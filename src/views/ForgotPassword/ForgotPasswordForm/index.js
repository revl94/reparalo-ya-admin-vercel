import React from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { Formik } from 'formik';
import { Box, Button, FormHelperText, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import useScriptRef from '../../../hooks/useScriptRef';
import useAuth from '../../../hooks/useAuth';
import * as actionTypes from '../../../store/actions';

const ForgotPasswordForm = ({ className, ...rest }) => {
    const scriptedRef = useScriptRef();
    const { forgotPassword } = useAuth();
    const dispatch = useDispatch();
    const initialValues = {
        email: '',
        submit: null,
    };
    const validations = Yup.object().shape({
        email: Yup.string().email('No es un correo electrónico válido').max(255).required('El correo electrónico es requerido'),
    });

    const onSubmit = async (values, { setErrors, setStatus, setSubmitting }) => {

        try {
            await forgotPassword(values.email);
            dispatch({
                type: actionTypes.SNACKBAR_OPEN,
                open: true,
                variant: 'alert',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
                message: '¡Correo electrónico para solicitar cambio de contraseña enviado, revisa tu email!',
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
                        error={Boolean(touched.email && errors.email)}
                        fullWidth
                        autoFocus
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
                        <Button color='primary' disabled={isSubmitting} fullWidth size='large' type='submit'
                                variant='contained'>
                            Restablecer contraseña
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
    );
};

ForgotPasswordForm.propTypes = {
    className: PropTypes.string,
};

ForgotPasswordForm.defaultProps = {
    className: '',
};

export default ForgotPasswordForm;
