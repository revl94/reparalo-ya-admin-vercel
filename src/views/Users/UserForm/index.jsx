import { Button, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import { gridSpacing } from '../../../constants/constant';
import SideBarDialog from '../../../components/SideBarDialog';
import useScriptRef from '../../../hooks/useScriptRef';
import useHttp from '../../../hooks/useHttp';
import API_ENDPOINTS from '../../../constants/api-endpoints';
import { SNACKBAR_OPEN } from '../../../store/actions';
import LoadingButton from '../../../components/LoadingButton';
import { ERROR_MESSAGE } from '../../../constants/messages';

const useStyles = makeStyles(() => ({
    userAddDialog: {
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
    userForm: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto',
    },
}));

const defaultValues = { fullName: '', email: '' };

const UserForm = ({
                      adminUser,
                      open,
                      handleCloseDialog,
                  }) => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const [, createAdminUser] = useHttp({
        method: 'POST',
        url: API_ENDPOINTS.ADMIN_USERS,
    }, { manual: true });
    const [, updateAdminUser] = useHttp({
        method: 'PUT',
        url: `${ API_ENDPOINTS.ADMIN_USERS }/${ adminUser?.id }`,
    }, { manual: true });
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        resetForm,
        handleSubmit,
    } = useFormik({
        initialValues: defaultValues,
        validationSchema: Yup.object().shape({
            fullName: Yup.string().max(255).required('El nombre completo es requerido'),
            email: Yup.string().email('No es un correo electrónico válido').max(255).required('El correo electrónico es requerido'),
        }),
        onSubmit: async (body, { setErrors, setStatus, setSubmitting }) => {
            try {
                if (!adminUser) {
                    await createAdminUser({ body });
                } else {
                    await updateAdminUser({ body });
                }

                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: `Usuario ${ !adminUser ? 'creado' : 'actualizado' } con éxito`,
                });

                handleCloseDialog(true);

                if (scriptedRef.current) {
                    setStatus({ success: true });
                    setSubmitting(false);
                }
            } catch (err) {
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    alertSeverity: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: ERROR_MESSAGE,
                });

                if (scriptedRef.current) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                }
            }
        },
    });

    useEffect(() => {
        resetForm({
            errors: {},
            touched: {},
            isSubmitting: false,
            values: adminUser ? { ...adminUser } : defaultValues,
        });
    }, [adminUser, open]);

    return (
        <SideBarDialog open={ open } handleCloseDialog={ () => handleCloseDialog() }
                       dialogClass={ classes.userAddDialog }>
            <form noValidate onSubmit={ handleSubmit } className={ classes.userForm }>
                <DialogTitle>Nuevo usuario</DialogTitle>
                <DialogContent>
                    <Grid container spacing={ gridSpacing }>
                        <Grid item xs={ 12 }>
                            <TextField
                                error={ Boolean(touched.fullName && errors.fullName) }
                                helperText={ touched.fullName && errors.fullName }
                                fullWidth
                                autoFocus
                                label='Nombre completo'
                                name='fullName'
                                onChange={ handleChange }
                                onBlur={ handleBlur }
                                value={ values.fullName }
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item xs={ 12 }>
                            <TextField
                                error={ Boolean(touched.email && errors.email) }
                                helperText={ touched.email && errors.email }
                                fullWidth
                                autoFocus
                                label='Correo electrónico'
                                name='email'
                                type='email'
                                onChange={ handleChange }
                                onBlur={ handleBlur }
                                value={ values.email }
                                variant='outlined'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <LoadingButton variant='contained'
                                   type='submit'
                                   color='primary'
                                   loading={ isSubmitting }
                                   disabled={ isSubmitting }
                                   startIcon={ !adminUser ? <AddIcon /> : <EditTwoToneIcon /> }>
                        { !adminUser ? 'Crear usuario' : 'Actualizar usuario' }
                    </LoadingButton>
                    <Button variant='text' onClick={ () => handleCloseDialog() } color='primary'>
                        Cerrar
                    </Button>
                </DialogActions>
            </form>
        </SideBarDialog>
    );
};

UserForm.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    adminUser: PropTypes.shape({
        id: PropTypes.number,
        fullName: PropTypes.string,
        email: PropTypes.string,
    }),
};

UserForm.defaultProps = {
    adminUser: null,
};

export default UserForm;
