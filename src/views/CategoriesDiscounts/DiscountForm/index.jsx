import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    TextField,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import EventTwoToneIcon from '@material-ui/icons/EventTwoTone';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { gridSpacing } from '../../../constants/constant';
import SideBarDialog from '../../../components/SideBarDialog';
import useScriptRef from '../../../hooks/useScriptRef';
import useHttp from '../../../hooks/useHttp';
import API_ENDPOINTS from '../../../constants/api-endpoints';
import { SNACKBAR_OPEN } from '../../../store/actions';
import LoadingButton from '../../../components/LoadingButton';
import { ERROR_MESSAGE } from '../../../constants/messages';
import Dropzone from '../../../components/Dropzone';
import convertToFormData from '../../../utils/convert-to-form-data';

const useStyles = makeStyles(() => ({
    discountAddDialog: {
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
    discountForm: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto',
    },
}));

const defaultValues = {
    category: '',
    description: '',
    discountPercentage: '',
    image: '',
    startDate: new Date(),
    endDate: new Date(),
};

const DiscountForm = ({
                          categoryDiscount,
                          categories,
                          open,
                          handleCloseDialog,
                      }) => {
    const classes = useStyles();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const [, createDiscount] = useHttp({
        method: 'POST',
        url: API_ENDPOINTS.CATEGORIES_DISCOUNTS,
    }, { manual: true });
    const [, updateDiscount] = useHttp({
        method: 'PUT',
        url: `${ API_ENDPOINTS.CATEGORIES_DISCOUNTS }/${ categoryDiscount?.id }`,
    }, { manual: true });
    const {
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        handleChange,
        handleBlur,
        resetForm,
        handleSubmit,
    } = useFormik({
        initialValues: defaultValues,
        validationSchema: Yup.object().shape({
            description: Yup.string().max(300),
            category: Yup.number().required('La categoría es requerida'),
            discountPercentage: Yup.number().required('El porcentaje es requerido'),
            image: !categoryDiscount ? Yup.string().required('La imagen es requerida') : Yup.string(),
            startDate: Yup.date().required('La fecha inicial es requerida'),
            endDate: Yup.date().required('La fecha final es requerida'),
        }),
        onSubmit: async (body, { setErrors, setStatus, setSubmitting }) => {
            console.log(body);
            try {
                if (!categoryDiscount) {
                    await createDiscount({
                        body: convertToFormData(
                            {
                                ...body,
                                image: body.image[0],
                            },
                        ),
                    });
                } else {
                    await updateDiscount({
                        body: convertToFormData(
                            {
                                ...body,
                                image: body.image[0],
                            },
                        ),
                    });
                }

                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: `Descuento ${ !categoryDiscount ? 'creado' : 'actualizado' } con éxito`,
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
            values: categoryDiscount ? {
                description: categoryDiscount.description,
                category: categoryDiscount.category.id,
                discountPercentage: categoryDiscount.discountPercentage,
                image: categoryDiscount.imageUrl,
                startDate: categoryDiscount.startDate,
                endDate: categoryDiscount.endDate,
            } : defaultValues,
        });
    }, [categoryDiscount, open]);

    return (
        <SideBarDialog open={ open } handleCloseDialog={ () => handleCloseDialog(false) }
                       dialogClass={ classes.discountAddDialog }>
            <form noValidate onSubmit={ handleSubmit } className={ classes.discountForm }>
                <DialogTitle>{ `${ !categoryDiscount ? 'Registrar' : 'Actualizar' } Descuento` }</DialogTitle>
                <DialogContent>
                    <Grid container spacing={ gridSpacing }>
                        <Grid item xs={ 12 }>
                            <FormControl fullWidth
                                         error={ Boolean(touched.category && errors.category) }>
                                <TextField
                                    select
                                    label='Categorías'
                                    name='category'
                                    error={ Boolean(touched.category && errors.category) }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                    value={ values.category }
                                    variant='outlined'>
                                    { categories.map(category => (
                                        <MenuItem key={ category.id } value={ category.id }>
                                            { category.name }
                                        </MenuItem>
                                    )) }
                                </TextField>
                                { touched.category && errors.category &&
                                <FormHelperText>{ errors.category }</FormHelperText>
                                }
                            </FormControl>
                        </Grid>
                        <Grid item xs={ 12 }>
                            <TextField
                                error={ Boolean(touched.description && errors.description) }
                                helperText={ touched.description && errors.description }
                                fullWidth
                                autoFocus
                                label='Descripción'
                                name='description'
                                onChange={ handleChange }
                                onBlur={ handleBlur }
                                value={ values.description }
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item xs={ 12 }>
                            <TextField
                                error={ Boolean(touched.discountPercentage && errors.discountPercentage) }
                                helperText={ touched.discountPercentage && errors.discountPercentage }
                                fullWidth
                                autoFocus
                                label='Porcentaje de Descuento'
                                name='discountPercentage'
                                type='number'
                                onChange={ handleChange }
                                onBlur={ handleBlur }
                                value={ values.discountPercentage }
                                variant='outlined'
                            />
                        </Grid>
                        <Grid item xs={ 12 }>
                            <MuiPickersUtilsProvider utils={ DateFnsUtils } locale={ es }>
                                <KeyboardDatePicker error={ Boolean(touched.startDate && errors.startDate) }
                                                    helperText={ touched.startDate && errors.startDate }
                                                    fullWidth
                                                    autoFocus
                                                    name='startDate'
                                                    onChange={ (date) =>
                                                        setFieldValue(
                                                            'startDate',
                                                            date,
                                                        ) }
                                                    onBlur={ handleBlur }
                                                    value={ values.startDate }
                                                    inputVariant='outlined'
                                                    format='dd/MM/yyyy'
                                                    label='Fecha Inicial'
                                                    KeyboardButtonProps={ { 'aria-label': 'change date' } }
                                                    keyboardIcon={ <EventTwoToneIcon /> }
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={ 12 }>
                            <MuiPickersUtilsProvider utils={ DateFnsUtils } locale={ es }>
                                <KeyboardDatePicker error={ Boolean(touched.endDate && errors.endDate) }
                                                    helperText={ touched.endDate && errors.endDate }
                                                    fullWidth
                                                    autoFocus
                                                    name='endDate'
                                                    onChange={ (date) =>
                                                        setFieldValue(
                                                            'endDate',
                                                            date,
                                                        ) }
                                                    onBlur={ handleBlur }
                                                    value={ values.endDate }
                                                    inputVariant='outlined'
                                                    format='dd/MM/yyyy'
                                                    label='Fecha Final'
                                                    KeyboardButtonProps={ { 'aria-label': 'change date' } }
                                                    keyboardIcon={ <EventTwoToneIcon /> }
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={ 12 }>
                            <Dropzone name='image'
                                      setFieldValue={ setFieldValue }
                                      helperText={ touched.image && errors.image }
                                      error={ Boolean(touched.image && errors.image) }
                                      value={ values.image }
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
                                   startIcon={ !categoryDiscount ? <AddIcon /> : <EditTwoToneIcon /> }>
                        { !categoryDiscount ? 'Registrar' : 'Actualizar' }
                    </LoadingButton>
                    <Button variant='text' onClick={ () => handleCloseDialog(false) } color='primary'>
                        Cerrar
                    </Button>
                </DialogActions>
            </form>
        </SideBarDialog>
    );
};

DiscountForm.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }),
    ).isRequired,
    categoryDiscount: PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string,
        discountPercentage: PropTypes.number.isRequired,
        imageUrl: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        category: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }),
    }),
};

DiscountForm.defaultProps = {
    categoryDiscount: null,
};

export default DiscountForm;
