import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import EventTwoToneIcon from '@material-ui/icons/EventTwoTone';
import { es } from 'date-fns/locale';
import Breadcrumb from '../../components/Breadcrumb';
import useHttp from '../../hooks/useHttp';
import API_ENDPOINTS from '../../constants/api-endpoints';
import { defaultTableOptions } from '../../constants/tables';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../../constants/constant';
import translateServiceRequestStatus from '../../utils/translate-service-request-status';
import formatDate from '../../utils/format-date';
import TableLoader from '../../components/TableLoader';
import ServiceRequestDetails from './ServiceRequestDetails';

const useStyles = makeStyles(() => ({
    table: {
        marginTop: '24px',
    },
}));

const DEFAULT_SORT_ORDER = {
    name: 'createdAt',
    direction: 'desc',
};

const INITIAL_FILTER_VALUES = {
    service: null,
    category: null,
    status: null,
    startDate: null,
    endDate: null,
};

const ServiceRequests = () => {
    const classes = useStyles();
    // const dispatch = useDispatch();
    const [requestParams, setRequestParams] = useState({
        page: DEFAULT_PAGE,
        size: DEFAULT_PAGE_SIZE,
        orderBy: DEFAULT_SORT_ORDER.name,
        orderDirection: DEFAULT_SORT_ORDER.direction.toUpperCase(),
        ...INITIAL_FILTER_VALUES,
    });
    const [{ data, isLoading }, getServiceRequests] = useHttp({
        url: API_ENDPOINTS.SERVICE_REQUESTS,
        params: requestParams,
    }, { manual: true });
    const [{ data: services = [] }] = useHttp({
        url: API_ENDPOINTS.SERVICES,
        params: { enable: true },
    });
    const [serviceRequest, setServiceRequest] = useState(null);
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [resetCategories, setResetCategories] = useState(true);

    const handleClickOpenDialog = (selectedServiceRequest) => {
        setServiceRequest(selectedServiceRequest);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setServiceRequest(null);
        setOpen(false);
    };

    const onTableChange = (action, tableState) => {
        switch (action) {
            case 'changePage':
                setRequestParams({
                    ...requestParams,
                    page: tableState.page,
                    size: tableState.rowsPerPage,
                });
                break;
            case 'changeRowsPerPage':
                setRequestParams({
                    ...requestParams,
                    page: DEFAULT_PAGE,
                    size: tableState.rowsPerPage,
                });
                break;
            case 'sort':
                setRequestParams({
                    ...requestParams,
                    orderBy: tableState.sortOrder.name,
                    orderDirection: tableState.sortOrder.direction.toUpperCase(),
                });
                break;
            case 'resetFilters':
                setResetCategories(true);
                setRequestParams(prevState => ({
                    ...prevState,
                    ...INITIAL_FILTER_VALUES
                }));
                break;
            default:
                break;
        }
    };

    const onFilterChipClose = (index, removedFilter, filterList) => {
        let filters = {};
        filterList.forEach(filter => filter.forEach(filterValue => {
            filters = {
                ...filters,
                [filterValue.name]: filterValue.value,
            };
        }));
        setRequestParams(
            prevState => ({
                ...prevState,
                ...INITIAL_FILTER_VALUES,
                ...filters,
            }),
        );
        setResetCategories(!filters.service);
    };

    const tableOptions = {
        ...defaultTableOptions,
        selectableRows: 'none',
        serverSide: true,
        filter: true,
        search: false,
        filterType: 'dropdown',
        sortOrder: DEFAULT_SORT_ORDER,
        count: data?.total || 0,
        rowsPerPage: requestParams?.size,
        page: requestParams.page,
        setFilterChipProps: () => ({ color: 'primary', variant: 'outlined' }),
        onRowClick: (_, { dataIndex }) => handleClickOpenDialog(data.content[dataIndex]),
        onFilterChipClose,
        onTableChange,
    };

    const columns = [
        {
            name: 'service',
            label: 'Servicio',
            options: {
                filter: true,
                filterType: 'custom',
                sort: true,
                filterOptions: {
                    fullWidth: false,
                    display: (filterList, onChange, index, column) => (
                        <FormControl>
                            <InputLabel>Servicios</InputLabel>
                            <Select value={ requestParams?.service || '' }
                                    onChange={ event => {
                                        const selectedService = services.find(service => service.id === event.target.value);
                                        setRequestParams(prevState => ({
                                            ...prevState,
                                            service: event.target.value,
                                        }));
                                        setCategories([...selectedService.categories]);
                                        setResetCategories(false);
                                        // eslint-disable-next-line no-param-reassign
                                        filterList[index] = [{
                                            name: column.name,
                                            chipLabel: selectedService.name,
                                            value: event.target.value,
                                        }];
                                        onChange(filterList[index], index, column);
                                    } }>
                                { services.map(service => (
                                    <MenuItem key={ service.id } value={ service.id }>
                                        { service.name }
                                    </MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                    ),
                },
                customFilterListOptions: {
                    render: (value) => (value[0].chipLabel),
                    update: (filterList, filterPos, index) => {
                        filterList[index].splice(filterPos, 1);
                        return filterList;
                    },
                },
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].category.service.name),
            },
        },
        {
            name: 'category',
            label: 'Categoría',
            options: {
                filter: true,
                filterType: 'custom',
                sort: true,
                filterOptions: {
                    fullWidth: false,
                    display: (filterList, onChange, index, column) => (
                        <FormControl>
                            <InputLabel>Categorías</InputLabel>
                            <Select value={ requestParams?.category || '' }
                                    onChange={ event => {
                                        setRequestParams(prevState => ({
                                            ...prevState,
                                            category: event.target.value,
                                        }));
                                        // eslint-disable-next-line no-param-reassign
                                        filterList[index] = [{
                                            name: column.name,
                                            chipLabel: categories.find(category => category.id === event.target.value).name,
                                            value: event.target.value,
                                        }];
                                        onChange(filterList[index], index, column);
                                    } }>
                                { categories.map(category => (
                                    <MenuItem key={ category.id } value={ category.id }>
                                        { category.name }
                                    </MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                    ),
                },
                customFilterListOptions: {
                    render: (value) => (value[0].chipLabel),
                    update: (filterList, filterPos, index) => {
                        filterList[index].splice(filterPos, 1);
                        return filterList;
                    },
                },
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].category.name),
            },
        },
        {
            name: 'user',
            label: 'Usuario',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].user.username),
            },
        },
        {
            name: 'phoneNumber',
            label: 'Número de contacto',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].user.userDetails.phoneNumber),
            },
        },
        {
            name: 'status',
            label: 'Estatus de la Solicitud',
            options: {
                filter: true,
                filterType: 'custom',
                sort: true,
                filterOptions: {
                    fullWidth: false,
                    display: (filterList, onChange, index, column) => (
                        <FormControl>
                            <InputLabel>Estatus</InputLabel>
                            <Select value={ requestParams?.status || '' }
                                    onChange={ event => {
                                        setRequestParams(prevState => ({
                                            ...prevState,
                                            status: event.target.value,
                                        }));
                                        // eslint-disable-next-line no-param-reassign
                                        filterList[index] = [{
                                            name: column.name,
                                            chipLabel: translateServiceRequestStatus(event.target.value),
                                            value: event.target.value,
                                        }];
                                        onChange(filterList[index], index, column);
                                    } }>
                                { ['NEW', 'IN_PROCESS', 'RESPONSE_SENT', 'VISIT_MADE'].map(status => (
                                    <MenuItem key={ status } value={ status }>
                                        { translateServiceRequestStatus(status) }
                                    </MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                    ),
                },
                customFilterListOptions: {
                    render: (value) => (value[0].chipLabel),
                    update: (filterList, filterPos, index) => {
                        filterList[index].splice(filterPos, 1);
                        return filterList;
                    },
                },
                customBodyRenderLite: (dataIndex) => (translateServiceRequestStatus(data.content[dataIndex].status)),
            },
        },
        {
            name: 'createdAt',
            label: 'Fecha de Creación',
            options: {
                filter: false,
                sort: true,
                customBodyRenderLite: (dataIndex) => (formatDate(new Date(data.content[dataIndex].createdAt))),
            },
        },
        {
            name: 'startDate',
            options: {
                viewColumns: false,
                display: false,
                filter: true,
                filterType: 'custom',
                filterOptions: {
                    fullWidth: false,
                    display: (filterList, onChange, index, column) => (
                        <MuiPickersUtilsProvider utils={ DateFnsUtils } locale={ es }>
                            <KeyboardDatePicker variant='inline'
                                                format='dd/MM/yyyy'
                                                margin='normal'
                                                label='Fecha Inicial'
                                                readonly
                                                value={ requestParams?.startDate || null }
                                                onChange={ event => {
                                                    if (event && Date.parse(event.toString())) {
                                                        setRequestParams(prevState => ({
                                                            ...prevState,
                                                            startDate: new Date(event),
                                                        }));
                                                        // eslint-disable-next-line no-param-reassign
                                                        filterList[index] = [{
                                                            name: column.name,
                                                            value: event.toString(),
                                                        }];
                                                        onChange(filterList[index], index, column);
                                                    }
                                                } }
                                                KeyboardButtonProps={ { 'aria-label': 'change date' } }
                                                keyboardIcon={ <EventTwoToneIcon /> }
                            />
                        </MuiPickersUtilsProvider>
                    ),
                },
                customFilterListOptions: {
                    render: (value) => (formatDate(new Date(value[0].value))),
                    update: (filterList, filterPos, index) => {
                        filterList[index].splice(filterPos, 1);
                        return filterList;
                    },
                },
            },
        },
        {
            name: 'endDate',
            options: {
                viewColumns: false,
                display: false,
                filter: true,
                filterType: 'custom',
                filterOptions: {
                    fullWidth: false,
                    display: (filterList, onChange, index, column) => (
                        <MuiPickersUtilsProvider utils={ DateFnsUtils }>
                            <KeyboardDatePicker variant='inline'
                                                format='dd/MM/yyyy'
                                                margin='normal'
                                                label='Fecha Final'
                                                value={ requestParams?.endDate || null }
                                                onChange={ event => {
                                                    if (event && Date.parse(event.toString())) {
                                                        setRequestParams(prevState => ({
                                                            ...prevState,
                                                            endDate: new Date(event),
                                                        }));
                                                        // eslint-disable-next-line no-param-reassign
                                                        filterList[index] = [{
                                                            name: column.name,
                                                            value: event.toString(),
                                                        }];
                                                        onChange(filterList[index], index, column);
                                                    }
                                                } }
                                                KeyboardButtonProps={ { 'aria-label': 'change date' } }
                                                keyboardIcon={ <EventTwoToneIcon /> }
                            />
                        </MuiPickersUtilsProvider>
                    ),
                },
                customFilterListOptions: {
                    render: (value) => (formatDate(new Date(value[0].value))),
                    update: (filterList, filterPos, index) => {
                        filterList[index].splice(filterPos, 1);
                        return filterList;
                    },
                },
            },
        },
    ];

    useEffect(() => {
        getServiceRequests({
            params: requestParams,
        });
    }, [requestParams]);

    useEffect(() => {
        if (resetCategories) {
            let temporalCategories = [];
            services?.forEach(service => {
                temporalCategories = [
                    ...temporalCategories,
                    ...service.categories,
                ];
            });
            setCategories([...temporalCategories]);
        }
    }, [services, resetCategories]);

    return (
        <>
            <Breadcrumb title='Solicitudes de Servicio'>
                <Typography component={ Link } to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
                    Inicio
                </Typography>
                <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
                    Solicitudes de Servicios
                </Typography>
            </Breadcrumb>

            { open &&
            <ServiceRequestDetails handleCloseDialog={ handleCloseDialog }
                                   open={ open }
                                   serviceRequest={ serviceRequest }
            />
            }

            <MUIDataTable title={
                <Typography variant='h6'>
                    Solicitudes
                    { isLoading && <TableLoader /> }
                </Typography>
            }
                          data={ data?.content || [] }
                          columns={ columns }
                          options={ tableOptions }
                          className={ classes.table } />
        </>
    );
};

export default ServiceRequests;
