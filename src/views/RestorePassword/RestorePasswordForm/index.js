import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';
import useScriptRef from '../../../hooks/useScriptRef';
import useAuth from '../../../hooks/useAuth';
import * as actionTypes from '../../../store/actions';

const RestorePasswordForm = ({ className, ...rest }) => {
    const scriptedRef = useScriptRef();
    const { restorePassword } = useAuth();
    const location = useLocation();
    const dispatch = useDispatch();
    const initialValues = {
        password: '',
        confirmPassword: '',
        submit: null,
    };
    const validations = Yup.object().shape({
        password: Yup.string().max(255).required('La contraseña es requerida'),
        confirmPassword: Yup.string().max(255).required('La contraseña es requerida').oneOf([Yup.ref("password"), null], "Las contraseñas deben coincidir")
    });

    const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {

        try {
            await restorePassword(values.password, location.search.split('token=')[1]);
            dispatch({
                type: actionTypes.SNACKBAR_OPEN,
                open: true,
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                message: '¡Contraseña reestablecida con exito!',
            });

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
            initialValues={initialValues}
            validationSchema={validations}
            onSubmit={onSubmit}
        >
            {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
              }) => (
                <form noValidate onSubmit={handleSubmit} className={clsx(className)} {...rest}>
                    <TextField
                        error={ Boolean(touched.password && errors.password) }
                        fullWidth
                        helperText={ touched.password && errors.password }
                        label='Contraseña'
                        margin='normal'
                        name='password'
                        onBlur={ handleBlur }
                        onChange={ handleChange }
                        type='password'
                        value={ values.password }
                        variant='outlined'
                    />
                    <TextField
                        error={ Boolean(touched.confirmPassword && errors.confirmPassword) }
                        fullWidth
                        helperText={ touched.confirmPassword && errors.confirmPassword }
                        label='Repita contraseña'
                        margin='normal'
                        name='confirmPassword'
                        onBlur={ handleBlur }
                        onChange={ handleChange }
                        type='password'
                        value={ values.confirmPassword }
                        variant='outlined'
                    />
                    { errors.submit && (
                        <Box mt={ 3 }>
                            <FormHelperText error>{ errors.submit }</FormHelperText>
                        </Box>
                    ) }
                    <Box mt={2}>
                        <Button color='primary' disabled={isSubmitting} fullWidth size='large' type='submit'
                                variant='contained'>
                            Establecer contraseña
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

RestorePasswordForm.propTypes = {
    className: PropTypes.string,
};

RestorePasswordForm.defaultProps = {
    className: '',
};

export default RestorePasswordForm;
