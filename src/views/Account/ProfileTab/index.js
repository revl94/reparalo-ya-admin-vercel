import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormHelperText,
    Grid,
    TextField,
    Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { gridSpacing } from '../../../constants/constant';
import useHttp from '../../../hooks/useHttp';
import API_ENDPOINTS from '../../../constants/api-endpoints';
import getUserIdFromToken from '../../../utils/get-user-id-from-token';
import { SNACKBAR_OPEN } from '../../../store/actions';
import useScriptRef from '../../../hooks/useScriptRef';
import { ERROR_MESSAGE } from '../../../constants/messages';

const useStyles = makeStyles(() => ({}));

const ProfileTab = () => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const userId = getUserIdFromToken();
    const [{ data }] = useHttp('GET', `${API_ENDPOINTS.ADMIN_USERS}/${userId}`);
    const [, updateAdminUser] = useHttp('PUT', `${API_ENDPOINTS.ADMIN_USERS}/${userId}`, null, true);

    const defaultValues = {
        fullName: '',
        email: '',
        submit: null,
    };

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
                await updateAdminUser({ body });

                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: `Usuario actualizado con éxito`,
                });

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
            values: data ? { ...data } : defaultValues,
        });
    }, [data]);

    return (
        <Grid container spacing={gridSpacing}>

            <Grid item sm={12}>
                <Card className={classes.root}>
                    <CardHeader
                        title={
                            <Typography component='div' className='card-header'>
                                Detalles de Usuario
                            </Typography>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>

                                <form noValidate onSubmit={handleSubmit}>
                                    <TextField
                                        error={Boolean(touched.fullName && errors.fullName)}
                                        fullWidth
                                        autoFocus
                                        helperText={touched.fullName && errors.fullName}
                                        label='Nombre de Usuario'
                                        margin='normal'
                                        name='fullName'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.fullName}
                                        variant='outlined'
                                    />
                                    <TextField
                                        error={Boolean(touched.email && errors.email)}
                                        fullWidth
                                        helperText={touched.email && errors.email}
                                        label='Correo electrónico'
                                        margin='normal'
                                        name='email'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='email'
                                        value={values.email}
                                        variant='outlined'
                                    />
                                    {errors.submit && (
                                        <Box mt={3}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Box>
                                    )}
                                    <Box mt={2}>
                                        <Button color='primary' disabled={isSubmitting} size='large'
                                                type='submit'
                                                variant='contained'>
                                            Actualizar Detalles
                                        </Button>
                                    </Box>
                                </form>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ProfileTab;
