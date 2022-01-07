import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import Breadcrumb from '../../components/Breadcrumb';
import useHttp from '../../hooks/useHttp';
import API_ENDPOINTS from '../../constants/api-endpoints';
import { defaultTableOptions } from '../../constants/tables';
import AlertDialog from '../../components/AlertDialog';
import LoadingIconButton from '../../components/LoadingIconButton';
import { SNACKBAR_OPEN } from '../../store/actions';
import { ERROR_MESSAGE } from '../../constants/messages';
import ServiceDialog from './ServiceDialog';
import TableLoader from '../../components/TableLoader';

const useStyles = makeStyles(() => ({
    userListTable: {
        marginTop: '24px',
    },
}));

const Services = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [{ data = [], isLoading }, getServices] = useHttp({ url: API_ENDPOINTS.SERVICES });
    const [service, setService] = useState(null);
    const [open, setOpen] = useState(false);
    const [{ isLoading: isLoadingToggleEnable }, toggleEnableService] = useHttp({
        method: 'PATCH',
        url: API_ENDPOINTS.SERVICES,
    }, { manual: true });
    const [toggleEnable, setToggleEnable] = useState(null);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [toggleEnableDialogContent, setToggleEnableDialogContent] = useState({
        title: '',
        content: '',
    });
    const tableOptions = {
        ...defaultTableOptions,
        selectableRows: 'none',
    };

    const handleClickOpenDialog = (selectedService) => {
        setService(selectedService);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setService(null);
        setOpen(false);
    };

    const handleToggleEnableDialog = async (id, enable) => {
        setToggleEnable({
            id,
            enable,
        });
        setToggleEnableDialogContent({
            title: enable ? 'Deshabilitar servicio' : 'Habilitar servicio',
            content: enable ? '¿Esta seguro que desea deshabilitar el servicio?' : '¿Esta seguro que desea habilitar el servicio?',
        });
        setOpenConfirmationDialog(true);
    };

    const handleCloseToggleEnableDialog = async (response) => {
        setOpenConfirmationDialog(false);

        if (response) {
            try {
                await toggleEnableService(
                    {
                        url: API_ENDPOINTS.DISABLE_ENABLE_SERVICE.replace(':serviceId', toggleEnable.id.toString()),
                    },
                );

                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: `Servicio ${ toggleEnable.enable ? 'deshabilitado' : 'habilitado' } con éxito`,
                });

                setToggleEnable(null);

                await getServices();
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

    const columns = [
        {
            name: 'name',
            label: 'Nombre',
            options: {
                filter: false,
                sort: false,
                empty: true,
            },
        },
        {
            name: 'shortName',
            label: 'Nombre Corto',
            options: {
                filter: false,
                sort: false,
                empty: true,
            },
        },
        {
            name: 'categories',
            label: '# de Categorías',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => (data[dataIndex].categories?.length),
            },
        },
        {
            name: '',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => (
                    <Grid container spacing={ 2 } alignItems='center'>
                        <Grid item>
                            <LoadingIconButton color='secondary'
                                               tooltipLabel='Ver'
                                               onClick={ () => handleClickOpenDialog(data[dataIndex]) }>
                                <VisibilityIcon />
                            </LoadingIconButton>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <LoadingIconButton color='secondary'
                                               tooltipLabel={ data[dataIndex].enable ? 'Deshabilitar' : 'Habilitar' }
                                               loading={ isLoadingToggleEnable && toggleEnable === data[dataIndex].id }
                                               onClick={ () => handleToggleEnableDialog(data[dataIndex].id, data[dataIndex].enable) }>
                                { data[dataIndex].enable ? <BlockIcon /> : <CheckIcon /> }
                            </LoadingIconButton>
                        </Grid>
                    </Grid>
                ),
            },
        },
    ];

    useEffect(() => {
        if (open) {
            setService(data.find(s => s.id === service.id));
        }
    }, [data]);

    return (
        <>
            <Breadcrumb title='Lista de servicios'>
                <Typography component={ Link } to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
                    Inicio
                </Typography>
                <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
                    Servicios
                </Typography>
            </Breadcrumb>

            <ServiceDialog handleCloseDialog={ handleCloseDialog }
                           open={ open }
                           service={ service }
                           fetchServices={ async () => getServices() }
            />

            <MUIDataTable title={
                <Typography variant='h6'>
                    Servicios
                    { isLoading && <TableLoader /> }
                </Typography>
            }
                          data={ data || [] }
                          columns={ columns }
                          options={ tableOptions }
                          className={ classes.userListTable } />

            <AlertDialog open={ openConfirmationDialog }
                         handleClose={ handleCloseToggleEnableDialog }
                         title={ toggleEnableDialogContent.title }
                         content={ toggleEnableDialogContent.content }
                         agreeButtonText='Sí'
                         disagreeButtonText='No' />
        </>
    );
};

export default Services;
