import React, { useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { Fab, Grid, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import { gridSpacing } from '../../constants/constant';
import Breadcrumb from '../../components/Breadcrumb';
import Avatar from '../../components/Avatar';
import UserForm from './UserForm';
import useHttp from '../../hooks/useHttp';
import API_ENDPOINTS from '../../constants/api-endpoints';
import { defaultTableOptions } from '../../constants/tables';
import AlertDialog from '../../components/AlertDialog';
import LoadingIconButton from '../../components/LoadingIconButton';
import { SNACKBAR_OPEN } from '../../store/actions';
import { ERROR_MESSAGE } from '../../constants/messages';
import TableLoader from '../../components/TableLoader';

const useStyles = makeStyles(() => ({
    userListTable: {
        marginTop: '24px',
    },
}));

const Users = () => {
    const classes = useStyles();
    const [{ data, isLoading }, getAdminUsers] = useHttp({
        url: API_ENDPOINTS.ADMIN_USERS,
    });
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [
        {
            isLoading: isLoadingDelete,
        },
        deleteAdminUser] = useHttp({
        method: 'DELETE',
        url: API_ENDPOINTS.ADMIN_USERS,
    }, { manual: true });
    const tableOptions = {
        ...defaultTableOptions,
        selectableRows: 'none',
    };

    const handleClickOpenDialog = (user) => {
        setAdminUser(user);
        setOpen(true);
    };

    const handleCloseDialog = async (fetchData = false) => {
        try {
            setOpen(false);

            if (fetchData) {
                await getAdminUsers();
            }
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
    };

    const handleDeleteAdminUser = async (id) => {
        setDeleteId(id);
        setOpenConfirmationDialog(true);
    };

    const handleCloseConfirmationDialog = async (response) => {
        setOpenConfirmationDialog(false);

        if (response) {
            try {
                await deleteAdminUser({ url: `${ API_ENDPOINTS.ADMIN_USERS }/${ deleteId }` });

                setDeleteId(null);

                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: 'Usuario eliminado con éxito',
                });

                await getAdminUsers();
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
            name: 'fullName',
            label: 'Nombre Completo',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => (
                    <Grid container spacing={ 2 } alignItems='center'>
                        <Grid item>
                            <Avatar color='primary'>{ data[dataIndex]?.fullName?.charAt(0) }</Avatar>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography align='left' component='div' variant='subtitle1'>
                                { data[dataIndex]?.fullName }
                            </Typography>
                        </Grid>
                    </Grid>
                ),
            },
        },
        {
            name: 'email',
            label: 'Correo electrónico',
            options: {
                filter: false,
                sort: false,
                empty: true,
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
                                               loading={ isLoadingDelete && deleteId === data[dataIndex].id }
                                               onClick={ () => handleDeleteAdminUser(data[dataIndex].id) }>
                                <DeleteIcon />
                            </LoadingIconButton>
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <IconButton color='secondary' onClick={ () => handleClickOpenDialog(data[dataIndex]) }>
                                <EditTwoToneIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ),
            },
        },
    ];

    return (
        <>
            <Breadcrumb title='Lista de usuarios'>
                <Typography component={ Link } to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
                    Inicio
                </Typography>
                <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
                    Usuarios
                </Typography>
            </Breadcrumb>

            <Grid container wrap='nowrap' justifyContent='flex-end' spacing={ gridSpacing }>
                <Grid item>
                    <Fab color='primary' size='small' onClick={ () => handleClickOpenDialog(null) }>
                        <AddIcon />
                    </Fab>
                    <UserForm handleCloseDialog={ handleCloseDialog }
                              open={ open }
                              adminUser={ adminUser }
                    />
                </Grid>
            </Grid>

            <MUIDataTable title={
                <Typography variant='h6'>
                    Usuarios
                    { isLoading && <TableLoader /> }
                </Typography>
            }
                          data={ data || [] }
                          columns={ columns }
                          options={ tableOptions }
                          className={ classes.userListTable } />

            <AlertDialog open={ openConfirmationDialog }
                         handleClose={ handleCloseConfirmationDialog }
                         title='Eliminar usuario'
                         content='¿Esta seguro que desea eliminar al usuario?'
                         agreeButtonText='Sí'
                         disagreeButtonText='No' />
        </>
    );
};

export default Users;
