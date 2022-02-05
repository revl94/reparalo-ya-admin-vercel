import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import translateServiceRequestStatus from '../../utils/translate-service-request-status';
import PieCard from '../../components/Charts/PieCard';

const defaultRequestsPerStatusData = {
    type: 'donut',
    height: 300,
    options: {
        dataLabels: {
            enabled: false,
        },
        labels: [],
        legend: {
            show: false,
            position: 'bottom',
            fontFamily: 'inherit',
            labels: {
                colors: 'inherit',
            },
        },
        itemMargin: {
            horizontal: 10,
            vertical: 10,
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#775DD0', '#D4526E', '#2E294E', '#F86624', '#C5D86D', '#7D02EB', '#5C4742', '#F9A3A4', '#546E7A'],
    },
    series: [],
};

const RequestsPerStatusCard = ({ requestsPerStatus }) => {
    const [requestsPerStatusData, setRequestsPerStatusData] = useState(defaultRequestsPerStatusData);

    useEffect(() => {
        if (requestsPerStatus) {
            const labels = [];
            const series = [];
            requestsPerStatus.forEach(requestPerStatus => {
                labels.push(translateServiceRequestStatus(requestPerStatus.status));
                series.push(requestPerStatus.count);
            });
            setRequestsPerStatusData({
                ...defaultRequestsPerStatusData,
                options: {
                    ...defaultRequestsPerStatusData.options,
                    labels,
                },
                series,
            });
        }
    }, [requestsPerStatus]);

    return (
        <PieCard chartData={ requestsPerStatusData }
                 title='Solicitudes por Estatus' />
    );
};

RequestsPerStatusCard.propTypes = {
    requestsPerStatus: PropTypes.arrayOf(
        PropTypes.shape(
            {
                status: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
            },
        ),
    ).isRequired,
};

export default RequestsPerStatusCard;
