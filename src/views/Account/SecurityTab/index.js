import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider, FormHelperText,
    Grid,
    TextField,
    Typography,
    InputAdornment,
    IconButton
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { SNACKBAR_OPEN } from '../../../store/actions';
import { ERROR_MESSAGE } from '../../../constants/messages';
import { gridSpacing } from '../../../constants/constant';
import useHttp from '../../../hooks/useHttp';
import API_ENDPOINTS from '../../../constants/api-endpoints';
import getUserIdFromToken from '../../../utils/get-user-id-from-token';
import useScriptRef from '../../../hooks/useScriptRef';

const useStyles = makeStyles(() => ({}));

const SecurityTab = () => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const userId = getUserIdFromToken();
    const [showPassword, setShowPassword] = useState(false);
    const [, updatePassword] = useHttp('PATCH', `${API_ENDPOINTS.ADMIN_USERS}/${userId}/password`, null, true);


    const defaultValues = {
        password: '',
        confirmPassword: '',
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
            password: Yup.string().max(255).required('La contraseña es requerida'),
            confirmPassword: Yup.string().max(255).required('La confirmación de contraseña es requerida').oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir'),
        }),
        onSubmit: async (body, { setErrors, setStatus, setSubmitting }) => {

            try {
                await updatePassword({ body });

                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: `Contraseña actualizada con éxito`,
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        resetForm({
            errors: {},
            touched: {},
            isSubmitting: false,
            values: defaultValues,
        });
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={8}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Card className={classes.root}>
                            <CardHeader
                                title={
                                    <Typography component='div' className='card-header'>
                                        Actualizar Contraseña
                                    </Typography>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={gridSpacing}>

                                    <Grid item xs={12}>

                                        <form noValidate onSubmit={handleSubmit}>
                                            <TextField
                                                error={Boolean(touched.password && errors.password)}
                                                fullWidth
                                                autoFocus
                                                helperText={touched.password && errors.password}
                                                label='Contraseña nueva'
                                                margin='normal'
                                                name='password'
                                                type={showPassword ? "text" : "password"}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.password}
                                                variant='outlined'
                                                InputProps={{
                                                    endAdornment: (
                                                    <InputAdornment position='end'>
                                                    <IconButton
                                                    aria-label='toggle password visibility'
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    >
                                                {!showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                    </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <TextField
                                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                                fullWidth
                                                helperText={touched.confirmPassword && errors.confirmPassword}
                                                label='Confirmar nueva Contraseña'
                                                margin='normal'
                                                name='confirmPassword'
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type={showPassword ? "text" : "password"}
                                                value={values.confirmPassword}
                                                variant='outlined'
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position='end'>
                                                            <IconButton
                                                                aria-label='toggle password visibility'
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {!showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
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
                                                    Actualizar Contraseña
                                                </Button>
                                            </Box>
                                        </form>

                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item sm={6} md={4}>
                <Grid container spacing={gridSpacing}>
                    <Grid item>
                        <Card>
                            <CardHeader
                                title={
                                    <Typography component='div' className='card-header'>
                                        Desactivar Cuenta
                                    </Typography>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant='subtitle2'>
                                            Esta accion es permanente, para volver a activar la cuenta pongase en
                                            contacto con un usuario Administrador.
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button variant='contained' size='small'>
                                            Desactivar Cuenta
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SecurityTab;
