import React, { useState } from 'react';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, IconButton, InputAdornment, TextField } from '@material-ui/core';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useAuth from '../../../hooks/useAuth';
import useScriptRef from '../../../hooks/useScriptRef';

const LoginForm = () => {
    const { login } = useAuth();
    const scriptedRef = useScriptRef();
    const [showPassword, setShowPassword] = useState(false);
    const initialValues = {
        email: '',
        password: '',
        submit: null,
    };
    const validations = Yup.object().shape({
        email: Yup.string().email('No es un correo electrónico válido').max(255).required('El correo electrónico es requerido'),
        password: Yup.string().max(255).required('La contraseña es requerida'),
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
            await login(values.email, values.password);

            if (scriptedRef.current) {
                setStatus({ success: true });
                setSubmitting(false);
            }
        } catch (err) {
            if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
            }
        }
    };

    return (
        <Formik
            initialValues={ initialValues }
            validationSchema={ validations }
            onSubmit={ onSubmit }
        >
            { ({
                   errors,
                   handleBlur,
                   handleChange,
                   handleSubmit,
                   isSubmitting,
                   touched,
                   values,
               }) => (
                <form noValidate onSubmit={ handleSubmit }>
                    <TextField
                        error={ Boolean(touched.email && errors.email) }
                        fullWidth
                        autoFocus
                        helperText={ touched.email && errors.email }
                        label='Correo electrónico'
                        margin='normal'
                        name='email'
                        onBlur={ handleBlur }
                        onChange={ handleChange }
                        type='email'
                        value={ values.email }
                        variant='outlined'
                    />
                    <TextField
                        error={ Boolean(touched.password && errors.password) }
                        fullWidth
                        helperText={ touched.password && errors.password }
                        label='Contraseña'
                        margin='normal'
                        name='password'
                        onBlur={ handleBlur }
                        onChange={ handleChange }
                        type={showPassword ? "text" : "password"}
                        value={ values.password }
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
                    { errors.submit && (
                        <Box mt={ 3 }>
                            <FormHelperText error>{ errors.submit }</FormHelperText>
                        </Box>
                    ) }
                    <Box mt={ 2 }>
                        <Button color='primary' disabled={ isSubmitting } fullWidth size='large' type='submit'
                                variant='contained'>
                            Iniciar sesión
                        </Button>
                    </Box>
                </form>
            ) }
        </Formik>
    );
};

export default LoginForm;
