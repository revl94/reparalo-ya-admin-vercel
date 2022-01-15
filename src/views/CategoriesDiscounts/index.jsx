import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { Fab, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import EventTwoToneIcon from '@material-ui/icons/EventTwoTone';
import { es } from 'date-fns/locale';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import { useDispatch } from 'react-redux';
import Breadcrumb from '../../components/Breadcrumb';
import useHttp from '../../hooks/useHttp';
import API_ENDPOINTS from '../../constants/api-endpoints';
import { defaultTableOptions } from '../../constants/tables';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, gridSpacing } from '../../constants/constant';
import formatDate from '../../utils/format-date';
import TableLoader from '../../components/TableLoader';
import LoadingIconButton from '../../components/LoadingIconButton';
import AlertDialog from '../../components/AlertDialog';
import DiscountForm from './DiscountForm';
import { SNACKBAR_OPEN } from '../../store/actions';
import { ERROR_MESSAGE } from '../../constants/messages';

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
    category: null,
    startDate: null,
    endDate: null,
};

const CategoriesDiscounts = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [requestParams, setRequestParams] = useState({
        page: DEFAULT_PAGE,
        size: DEFAULT_PAGE_SIZE,
        orderBy: DEFAULT_SORT_ORDER.name,
        orderDirection: DEFAULT_SORT_ORDER.direction.toUpperCase(),
        ...INITIAL_FILTER_VALUES,
    });
    const [{ data, isLoading }, getCategoriesDiscounts] = useHttp({
        url: API_ENDPOINTS.CATEGORIES_DISCOUNTS,
        params: requestParams,
    }, { manual: true });
    const [{ isLoading: isLoadingDelete }, deleteDiscount] = useHttp(
        { method: 'DELETE', url: API_ENDPOINTS.CATEGORIES_DISCOUNTS },
        { manual: true },
    );
    const [{ data: services = [] }] = useHttp({
        url: API_ENDPOINTS.SERVICES,
        params: { enable: true },
    });
    const [deleteId, setDeleteId] = useState(null);
    const [categoryDiscount, setCategoryDiscount] = useState(null);
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

    const handleClickOpenDialog = (selectedServiceRequest) => {
        setCategoryDiscount(selectedServiceRequest);
        setOpen(true);
    };

    const handleCloseDialog = async (mustGetDiscounts) => {
        if (mustGetDiscounts) {
            await getCategoriesDiscounts({
                params: requestParams,
            });
        }
        setCategoryDiscount(null);
        setOpen(false);
    };

    const handleDeleteDiscount = async (id) => {
        setDeleteId(id);
        setOpenConfirmationDialog(true);
    };

    const handleCloseConfirmationDialog = async (response) => {
        setOpenConfirmationDialog(false);
        if (response) {
            try {
                await deleteDiscount({ url: `${ API_ENDPOINTS.CATEGORIES_DISCOUNTS }/${ deleteId }` });
                setDeleteId(null);
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: 'Descuento eliminado con éxito',
                });
                await getCategoriesDiscounts();
            } catch (e) {
                dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    variant: 'alert',
                    alertSeverity: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                    message: ERROR_MESSAGE,
                });
            }
        }
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
        sortOrder: DEFAULT_SORT_ORDER,
        count: data?.total || 0,
        rowsPerPage: requestParams?.size,
        page: requestParams.page,
        setFilterChipProps: () => ({ color: 'primary', variant: 'outlined' }),
        onFilterChipClose,
        onTableChange,
    };

    const columns = [
        {
            name: 'category',
            label: 'Categoría',
            options: {
                filter: true,
                filterType: 'custom',
                sort: true,
                filterOptions: {
                    fullWidth: true,
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
            name: 'discountPercentage',
            label: 'Porcentaje de Descuento',
            options: {
                filter: false,
                sort: false,
                customBodyRenderLite: (dataIndex) => (`${ data.content[dataIndex].discountPercentage }%`),
            },
        },
        {
            name: 'startDate',
            label: 'Fecha Inicial',
            options: {
                filter: true,
                filterType: 'custom',
                sort: true,
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
                customBodyRenderLite: (dataIndex) => (formatDate(new Date(`${ data.content[dataIndex].startDate }T04:00:00.000Z`))),
            },
        },
        {
            name: 'endDate',
            label: 'Fecha Fin',
            options: {
                filter: true,
                filterType: 'custom',
                sort: true,
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
                customBodyRenderLite: (dataIndex) => (formatDate(new Date(`${ data.content[dataIndex].endDate }T04:00:00.000Z`))),
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
            name: 'edit',
            label: ' ',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => (
                    <IconButton color='secondary' onClick={ () => handleClickOpenDialog(data.content[dataIndex]) }>
                        <EditTwoToneIcon />
                    </IconButton>
                ),
            },
        },
        {
            name: 'delete',
            label: ' ',
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => (
                    <LoadingIconButton color='secondary'
                                       loading={ isLoadingDelete && deleteId === data.content[dataIndex].id }
                                       onClick={ () => handleDeleteDiscount(data.content[dataIndex].id) }>
                        <DeleteIcon />
                    </LoadingIconButton>
                ),
            },
        },
    ];

    useEffect(() => {
        getCategoriesDiscounts({
            params: requestParams,
        });
    }, [requestParams]);

    useEffect(() => {
        let temporalCategories = [];
        services?.forEach(service => {
            temporalCategories = [
                ...temporalCategories,
                ...service.categories,
            ];
        });
        setCategories([...temporalCategories]);
    }, [services]);

    return (
        <>
            <Breadcrumb title='Descuentos a Categorías'>
                <Typography component={ Link } to='/' variant='subtitle2' color='inherit' className='link-breadcrumb'>
                    Inicio
                </Typography>
                <Typography variant='subtitle2' color='primary' className='link-breadcrumb'>
                    Descuentos a Categorías
                </Typography>
            </Breadcrumb>

            <Grid container wrap='nowrap' justifyContent='flex-end' spacing={ gridSpacing }>
                <Grid item>
                    <Fab color='primary' size='small' onClick={ () => handleClickOpenDialog(null) }>
                        <AddIcon />
                    </Fab>
                    <DiscountForm handleCloseDialog={ handleCloseDialog }
                                  open={ open }
                                  categoryDiscount={ categoryDiscount }
                                  categories={ categories }
                    />
                </Grid>
            </Grid>

            <MUIDataTable title={
                <Typography variant='h6'>
                    Descuentos
                    { isLoading && <TableLoader /> }
                </Typography>
            }
                          data={ data?.content || [] }
                          columns={ columns }
                          options={ tableOptions }
                          className={ classes.table } />

            <AlertDialog open={ openConfirmationDialog }
                         handleClose={ handleCloseConfirmationDialog }
                         title='Eliminar descuento'
                         content='¿Esta seguro que desea eliminar el descuento?'
                         agreeButtonText='Sí'
                         disagreeButtonText='No' />
        </>
    );
};

export default CategoriesDiscounts;
