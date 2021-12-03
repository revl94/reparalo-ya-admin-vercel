import { Button, DialogActions, DialogContent, DialogTitle, Grid } from '@material-ui/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import { useDispatch } from 'react-redux';
import { gridSpacing } from '../../../constants/constant';
import SideBarDialog from '../../../components/SideBarDialog';
import LoadingIconButton from '../../../components/LoadingIconButton';
import useHttp from '../../../hooks/useHttp';
import API_ENDPOINTS from '../../../constants/api-endpoints';
import { SNACKBAR_OPEN } from '../../../store/actions';
import { ERROR_MESSAGE } from '../../../constants/messages';
import AlertDialog from '../../../components/AlertDialog';

const useStyles = makeStyles(() => ({
    dialog: {
        '&>div:nth-child(3)': {
            justifyContent: 'flex-end',
            height: 'auto',
            '&>div': {
                margin: '0px',
                borderRadius: '0px',
                maxWidth: '450px',
                height: '100vh',
            },
        },
    },
}));

const ServiceDialog = ({
                           service,
                           open,
                           handleCloseDialog,
                           fetchServices,
                       }) => {
    const classes = useStyles();
    const [
        {
            isLoading: isLoadingToggleEnable,
        },
        toggleEnableCategory,
    ] = useHttp('PATCH', API_ENDPOINTS.SERVICES, null, true);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [toggleEnable, setToggleEnable] = useState(null);
    const [toggleEnableDialogContent, setToggleEnableDialogContent] = useState({
        title: '',
        content: '',
    });
    const dispatch = useDispatch();

    const handleToggleEnableDialog = async (id, enable) => {
        setToggleEnable({
            id,
            enable,
        });
        setToggleEnableDialogContent({
            title: enable ? 'Deshabilitar categoría' : 'Habilitar categoría',
            content: enable ? '¿Esta seguro que desea deshabilitar la categoría?' : '¿Esta seguro que desea habilitar la categoría?',
        });
        setOpenConfirmationDialog(true);
    };

    const handleCloseToggleEnableDialog = async (response) => {
        setOpenConfirmationDialog(false);

        if (response) {
            try {
                await toggleEnableCategory(
                    {
                        url: API_ENDPOINTS.DISABLE_ENABLE_CATEGORY.replace(':serviceId', service.id.toString()).replace(':categoryId', toggleEnable.id),
                    },
                );

                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: `Categoría ${ toggleEnable.enable ? 'deshabilitada' : 'habilitada' } con éxito`,
                });

                setToggleEnable(null);
                fetchServices();
            } catch (e) {
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    alertSeverity: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: ERROR_MESSAGE,
                });
            }
        }
    };

    return (
        <SideBarDialog open={ open }
                       handleCloseDialog={ () => handleCloseDialog() }
                       dialogClass={ classes.dialog }>
            <DialogTitle>{ service?.name }</DialogTitle>
            <DialogContent>
                <Grid container spacing={ gridSpacing - 1 }>
                    <Grid item xs={ 12 }>
                        { service?.description }
                    </Grid>
                    <Grid item xs={ 12 }>
                        <p>
                            <strong>Estatus:</strong> { service?.enable ? 'Habilitado' : 'Deshabilitado' }
                        </p>
                    </Grid>
                    <Grid item xs={ 12 }>
                        <h4>Categorías</h4>
                    </Grid>
                    <Grid item container direction='column' spacing={ gridSpacing - 2 }>
                        {
                            service?.categories?.map(category => (
                                <Grid item container direction='row'
                                      alignItems='center' justifyContent='space-between'
                                      spacing={ 1 }
                                      key={ category.id }>
                                    <Grid item lg={ 6 } xs={ 12 }>
                                        <p>{ category.name }</p>
                                    </Grid>
                                    <Grid item>
                                        <LoadingIconButton color='secondary'
                                                           tooltipLabel={ category.enable ? 'Deshabilitar' : 'Habilitar' }
                                                           loading={ isLoadingToggleEnable && toggleEnable === category.id }
                                                           onClick={ () => handleToggleEnableDialog(category.id, category.enable) }>
                                            { category.enable ? <BlockIcon /> : <CheckIcon /> }
                                        </LoadingIconButton>
                                    </Grid>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='text' onClick={ () => handleCloseDialog() } color='primary'>
                    Cerrar
                </Button>
            </DialogActions>

            <AlertDialog open={ openConfirmationDialog }
                         handleClose={ handleCloseToggleEnableDialog }
                         title={ toggleEnableDialogContent.title }
                         content={ toggleEnableDialogContent.content }
                         agreeButtonText='Sí'
                         disagreeButtonText='No' />
        </SideBarDialog>
    );
};

ServiceDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    fetchServices: PropTypes.func.isRequired,
    service: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        icon: PropTypes.string,
        enable: PropTypes.bool,
        categories: PropTypes.arrayOf(
            PropTypes.shape({
                    id: PropTypes.number,
                    name: PropTypes.string,
                    description: PropTypes.string,
                    icon: PropTypes.string,
                    enable: PropTypes.bool,
                    imagePath: PropTypes.string,
                },
            ),
        ),
    }),
};

ServiceDialog.defaultProps = {
    service: null,
};

export default ServiceDialog;
