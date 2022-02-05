import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import LineCard from '../../components/Charts/LineCard';
import { DEFAULT_CHART_DATA } from '../../constants/constant';
import translateMonths from '../../utils/translate-months';
import translateServiceRequestStatus from '../../utils/translate-service-request-status';
import SERVICE_REQUEST_STATUS from '../../constants/service-request-status';

const useStyles = makeStyles(() => ({
    root: {
        color: '#ffff',
    },
}));

const RequestsByMonthCard = ({ requestsByMonth, getRequestsByMonth }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [requestsByMonthData, setRequestsByMonthData] = useState(DEFAULT_CHART_DATA);
    const [status, setStatus] = useState(SERVICE_REQUEST_STATUS[0]);

    useEffect(() => {
        getRequestsByMonth({ params: { status } });
    }, [status]);

    useEffect(() => {
        if (requestsByMonth) {
            const labels = [];
            const data = [];
            requestsByMonth.forEach(requestByMonth => {
                labels.push(translateMonths(requestByMonth.month, true));
                data.push(requestByMonth.count);
            });
            setRequestsByMonthData(prevState => (
                {
                    ...prevState,
                    options: {
                        ...prevState.options,
                        labels,
                        xaxis: {
                            ...prevState.options.xaxis,
                            categories: labels,
                        },
                        yaxis: {
                            min: Math.min(...data) === 0 ? 0 : Math.min(...data) - 1,
                            max: Math.max(...data) + 2,
                            show: false,
                        },
                        tooltip: {
                            ...prevState.options.tooltip,
                            y: {
                                title: {
                                    formatter: () => 'Solicitudes por Mes',
                                },
                                formatter: value => parseInt(value, 10),
                            },
                        },
                    },
                    series: [
                        {
                            name: requestsByMonth[0]?.status,
                            data,
                        },
                    ],
                }
            ));
        }
    }, [requestsByMonth]);

    return (
        <LineCard
            chartData={ requestsByMonthData }
            bgColor={ theme.palette.warning.main }
            title='Solicitudes por Mes'
        >
            <FormControl>
                <InputLabel style={ { color: '#fff' } }>Estatus</InputLabel>
                <Select value={ status }
                        classes={ {
                            root: classes.root,
                        } }
                        onChange={ event => setStatus(event.target.value) }>
                    { SERVICE_REQUEST_STATUS.map(serviceRequestStatus => (
                        <MenuItem key={ serviceRequestStatus } value={ serviceRequestStatus }>
                            { translateServiceRequestStatus(serviceRequestStatus) }
                        </MenuItem>
                    )) }
                </Select>
            </FormControl>
        </LineCard>
    );
};

RequestsByMonthCard.propTypes = {
    requestsByMonth: PropTypes.arrayOf(
        PropTypes.shape(
            {
                month: PropTypes.string.isRequired,
                status: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
            },
        ),
    ).isRequired,
    getRequestsByMonth: PropTypes.func.isRequired,
};

export default RequestsByMonthCard;
