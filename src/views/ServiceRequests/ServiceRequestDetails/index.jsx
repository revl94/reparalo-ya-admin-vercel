import {
    Button,
    CircularProgress,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SideBarDialog from '../../../components/SideBarDialog';
import formatDate from '../../../utils/format-date';
import Map from '../../../components/Map';
import { SNACKBAR_OPEN } from '../../../store/actions';
import { ERROR_MESSAGE } from '../../../constants/messages';
import useScriptRef from '../../../hooks/useScriptRef';
import API_ENDPOINTS from '../../../constants/api-endpoints';
import useHttp from '../../../hooks/useHttp';
import LoadingButton from '../../../components/LoadingButton';
import translateServiceRequestStatus from '../../../utils/translate-service-request-status';
import addLeadingZeros from '../../../utils/add-leading-zeros';
import DocumentPage from '../../../components/ServiceRequestDocument';
import SERVICE_REQUEST_STATUS from '../../../constants/service-request-status';

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

const ServiceRequestDetails = ({
                                   serviceRequest,
                                   open,
                                   handleCloseDialog,
                               }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const scriptedRef = useScriptRef();
    const [mustFetchAgain, setMustFetchAgain] = useState(false);
    const [{ isLoading }, updateStatus] = useHttp({
        method: 'PATCH',
        url: `${ API_ENDPOINTS.SERVICE_REQUESTS }/${ serviceRequest?.id }/status`,
    }, { manual: true });
    const [{ data: discount, isLoading: isLoadingDiscount }, getDiscount] = useHttp({
        url: `${ API_ENDPOINTS.CATEGORIES_DISCOUNTS }/active/categories/${ serviceRequest?.category?.id }`,
    }, { manual: true });
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useFormik({
        initialValues: { status: serviceRequest?.status },
        validationSchema: Yup.object().shape({
            status: Yup.string().required('El nombre completo es requerido'),
        }),
        onSubmit: async (body, { setErrors, setStatus, setSubmitting }) => {
            try {
                await updateStatus({ body });
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: `Estatus de la solicitud actualizado con éxito`,
                });

                setMustFetchAgain(true);

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
        if (serviceRequest) {
            getDiscount();
        }
    }, [serviceRequest]);


    return (
        <SideBarDialog open={ open }
                       handleCloseDialog={ () => handleCloseDialog(mustFetchAgain) }
                       dialogClass={ classes.dialog }>
            <DialogTitle>
                <Typography variant='h4' component='p'>
                    Solicitud #{ addLeadingZeros(serviceRequest?.requestNumber) }
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    {
                        ![
                            SERVICE_REQUEST_STATUS[2],
                            SERVICE_REQUEST_STATUS[3],
                            SERVICE_REQUEST_STATUS[8],
                            SERVICE_REQUEST_STATUS[9],
                        ].includes(serviceRequest?.status) &&
                        <Grid item xs={ 12 }>
                            <form noValidate onSubmit={ handleSubmit }>
                                <Grid container spacing={ 2 } direction='column'>
                                    <Grid item xs={ 12 }>
                                        <FormControl fullWidth>
                                            <InputLabel id='status-label'>Estatus de la Solicitud</InputLabel>
                                            <Select labelId='status-label'
                                                    id='status'
                                                    label='Estatus de la Solicitud'
                                                    name='status'
                                                    value={ values.status }
                                                    error={ Boolean(touched.status && errors.status) }
                                                    helperText={ touched.status && errors.status }
                                                    onChange={ handleChange }
                                                    onBlur={ handleBlur }
                                                    variant='outlined'>
                                                { SERVICE_REQUEST_STATUS.map(option => (
                                                    <MenuItem key={ option } value={ option }>
                                                        { translateServiceRequestStatus(option) }
                                                    </MenuItem>
                                                )) }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={ 12 }>
                                        <LoadingButton variant='contained'
                                                       type='submit'
                                                       color='primary'
                                                       loading={ isSubmitting || isLoading }
                                                       disabled={ isSubmitting || isLoading }
                                                       startIcon={ <EditTwoToneIcon /> }>
                                            Actualizar
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </form>
                        </Grid>
                    }
                    <Grid item xs={ 12 }>
                        <p>
                            <strong>Fecha de Creación:</strong> { formatDate(new Date(serviceRequest?.createdAt)) }
                        </p>
                    </Grid>
                    <Grid item xs={ 12 }>
                        <p>
                            <strong>Servicio:</strong> { serviceRequest?.category?.service?.name }
                        </p>
                    </Grid>
                    <Grid item xs={ 12 }>
                        <p>
                            <strong>Categoría:</strong> { serviceRequest?.category?.name }
                        </p>
                    </Grid>
                    <Grid item container xs={ 12 } style={ { marginLeft: 16 } }>
                        <p>
                            <strong>Descuento:</strong> {
                            isLoadingDiscount ?
                                <CircularProgress size={ 20 } style={ { marginLeft: 8 } } />
                                : `${ discount ? `${ discount.discountPercentage }%` : 'No tiene descuento.' }`
                        }
                        </p>
                    </Grid>
                    <Grid item xs={ 12 }>
                        <p>
                            <strong>Datos del Usuario:</strong>
                        </p>
                    </Grid>
                    <Grid item container xs={ 12 } style={ { marginLeft: 16 } }>
                        <Grid item xs={ 12 }>
                            <p>
                                <strong>Nombre Completo: </strong>
                                { serviceRequest?.user.userDetails.firstName } { serviceRequest?.user.userDetails.lastName }
                            </p>
                        </Grid>
                        <Grid item xs={ 12 }>
                            <p>
                                <strong>Teléfono: </strong> { serviceRequest?.user.userDetails.phoneNumber }
                            </p>
                        </Grid>
                        <Grid item xs={ 12 }>
                            <p>
                                <strong>Correo: </strong> { serviceRequest?.user.username }
                            </p>
                        </Grid>
                    </Grid>
                    <Grid item xs={ 12 }>
                        <p>
                            <strong>Respuestas del Formulario:</strong>
                        </p>
                    </Grid>
                    <Grid item container xs={ 12 } style={ { marginLeft: 16 } }>
                        { serviceRequest?.formAnswers?.map((formAnswer, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Grid item xs={ 12 } key={ index }>
                                <p>
                                    <strong>{ formAnswer.question }: </strong>
                                    { formAnswer?.answer }
                                </p>
                            </Grid>
                        )) }
                    </Grid>
                    <Grid item xs={ 12 }>
                        <p>
                            <strong>Ubicación:</strong>
                        </p>
                    </Grid>
                    <Grid item xs={ 12 }>
                        <Map position={ serviceRequest?.location } />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {
                    serviceRequest &&
                    <PDFDownloadLink
                        document={ <DocumentPage serviceRequest={ serviceRequest } /> }
                        fileName={ `solicitud-${ addLeadingZeros(serviceRequest?.requestNumber) }` }
                        style={ {
                            textDecoration: 'none',
                        } }
                    >
                        { ({ loading }) =>
                            <LoadingButton variant='contained'
                                           type='submit'
                                           color='primary'
                                           loading={ loading }
                                           disabled={ loading }>
                                Descargar en PDF
                            </LoadingButton>
                        }

                    </PDFDownloadLink>
                }
                <Button variant='text' onClick={ () => handleCloseDialog(mustFetchAgain) } color='primary'>
                    Cerrar
                </Button>
            </DialogActions>
        </SideBarDialog>
    );
};

ServiceRequestDetails.propTypes = {
    open: PropTypes.bool.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    serviceRequest: PropTypes.shape({
        id: PropTypes.number,
        status: PropTypes.string,
        requestNumber: PropTypes.number,
        // eslint-disable-next-line react/forbid-prop-types
        formAnswers: PropTypes.array,
        user: PropTypes.shape({
            id: PropTypes.number,
            username: PropTypes.string,
            userDetails: PropTypes.shape({
                firstName: PropTypes.string,
                lastName: PropTypes.string,
                phoneNumber: PropTypes.string,
            }),
        }),
        category: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            description: PropTypes.string,
            icon: PropTypes.string,
            service: PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                description: PropTypes.string,
            }),
        }),
        location: PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number,
        }),
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
    }).isRequired,
};

export default ServiceRequestDetails;
