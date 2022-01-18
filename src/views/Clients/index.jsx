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
import formatDate from '../../utils/format-date';
import TableLoader from '../../components/TableLoader';
import translateRegistrationStatus from '../../utils/translate-registration-status';

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
    registrationStatus: null,
    authenticationProvider: null,
    startDate: null,
    endDate: null,
};

const Clients = () => {
    const classes = useStyles();
    // const dispatch = useDispatch();
    const [requestParams, setRequestParams] = useState({
        page: DEFAULT_PAGE,
        size: DEFAULT_PAGE_SIZE,
        orderBy: DEFAULT_SORT_ORDER.name,
        orderDirection: DEFAULT_SORT_ORDER.direction.toUpperCase(),
        ...INITIAL_FILTER_VALUES,
    });
    const [{ data, isLoading }, getUsers] = useHttp({
        url: API_ENDPOINTS.USERS,
        params: requestParams,
    }, { manual: true });

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
                setRequestParams(prevState => ({
                    ...prevState,
                    ...INITIAL_FILTER_VALUES,
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
    };

    const tableOptions = {
        ...defaultTableOptions,
        selectableRows: 'none',
        serverSide: true,
        filter: true,
        search: false,
        filterType: 'dropdown',
        count: data?.total || 0,
        rowsPerPage: requestParams?.size,
        page: requestParams.page,
        setFilterChipProps: () => ({ color: 'primary', variant: 'outlined' }),
        onFilterChipClose,
        onTableChange,
    };

    const columns = [
        {
            name: 'username',
            label: 'Nombre de Usuario',
            options: {
                filter: false,
                sort: false,
                filterType: 'custom',
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].username),
            },
        },
        {
            name: 'firstName',
            label: 'Nombre',
            options: {
                filter: false,
                sort: true,
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].userDetails?.firstName),
            },
        },
        {
            name: 'lastName',
            label: 'Apellido',
            options: {
                filter: false,
                sort: true,
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].userDetails?.lastName),
            },
        },
        {
            name: 'phoneNumber',
            label: 'Número de Contacto',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].userDetails.phoneNumber),
            },
        },
        {
            name: 'registrationStatus',
            label: 'Estatus del Registro',
            options: {
                filter: true,
                filterType: 'custom',
                sort: true,
                filterOptions: {
                    fullWidth: false,
                    display: (filterList, onChange, index, column) => (
                        <FormControl>
                            <InputLabel>Estatus de Registro</InputLabel>
                            <Select value={ requestParams?.registrationStatus || '' }
                                    onChange={ event => {
                                        setRequestParams(prevState => ({
                                            ...prevState,
                                            registrationStatus: event.target.value,
                                        }));
                                        // eslint-disable-next-line no-param-reassign
                                        filterList[index] = [{
                                            name: column.name,
                                            chipLabel: translateRegistrationStatus(event.target.value),
                                            value: event.target.value,
                                        }];
                                        onChange(filterList[index], index, column);
                                    } }>
                                { ['PENDING_EMAIL_VERIFICATION', 'PENDING_PHONE_NUMBER_VERIFICATION', 'ACTIVE'].map(status => (
                                    <MenuItem key={ status } value={ status }>
                                        { translateRegistrationStatus(status) }
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
                customBodyRenderLite: (dataIndex) => (translateRegistrationStatus(data.content[dataIndex].registrationStatus)),
            },
        },
        {
            name: 'authenticationProvider',
            label: 'Tipo de Registro',
            options: {
                sort: true,
                filter: true,
                filterType: 'custom',
                filterOptions: {
                    fullWidth: false,
                    display: (filterList, onChange, index, column) => (
                        <FormControl>
                            <InputLabel>Tipo de Registro</InputLabel>
                            <Select value={ requestParams?.authenticationProvider || '' }
                                    onChange={ event => {
                                        setRequestParams(prevState => ({
                                            ...prevState,
                                            authenticationProvider: event.target.value,
                                        }));
                                        // eslint-disable-next-line no-param-reassign
                                        filterList[index] = [{
                                            name: column.name,
                                            chipLabel: event.target.value,
                                            value: event.target.value,
                                        }];
                                        onChange(filterList[index], index, column);
                                    } }>
                                { ['LOCAL', 'GOOGLE', 'FACEBOOK'].map(status => (
                                    <MenuItem key={ status } value={ status }>
                                        { status }
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
                customBodyRenderLite: (dataIndex) => (data.content[dataIndex].authenticationProvider),
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
                    render: (value) => `Fecha de Creación desde ${ (formatDate(new Date(value[0].value))) }`,
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
                    render: (value) => `Fecha de Creación hasta ${ (formatDate(new Date(value[0].value))) }`,
                    update: (filterList, filterPos, index) => {
                        filterList[index].splice(filterPos, 1);
                        return filterList;
                    },
                },
            },
        },
    ];

    useEffect(() => {
        getUsers({
            params: requestParams,
        });
    }, [requestParams]);
    return (
        <>
            <Breadcrumb title='Clientes Registrados'>
                <Typography component={ Link } to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
                    Inicio
                </Typography>
                <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
                    Clientes
                </Typography>
            </Breadcrumb>

            <MUIDataTable title={
                <Typography variant='h6'>
                    Clientes
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

export default Clients;
