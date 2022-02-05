import React, { useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LineCard from '../../components/Charts/LineCard';
import { DEFAULT_CHART_DATA } from '../../constants/constant';
import translateMonths from '../../utils/translate-months';

const ClientsByMonthCard = ({ clientsByMonth }) => {
    const theme = useTheme();
    const [clientsByMonthData, setClientsByMonthData] = useState(DEFAULT_CHART_DATA);

    useEffect(() => {
        if (clientsByMonth) {
            const labels = [];
            const data = [];
            clientsByMonth.forEach(clientByMonth => {
                labels.push(translateMonths(clientByMonth.month, true));
                data.push(clientByMonth.count);
            });
            setClientsByMonthData(prevState => (
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
                                    formatter: () => 'Clientes por Mes',
                                },
                            },
                        },
                    },
                    series: [
                        {
                            name: 'clients',
                            data,
                        },
                    ],
                }
            ));
        }
    }, [clientsByMonth]);

    return (
        <LineCard
            chartData={ clientsByMonthData }
            bgColor={ theme.palette.info.main }
            title='Clientes Registrados por Mes'
        />
    );
};

ClientsByMonthCard.propTypes = {
    clientsByMonth: PropTypes.arrayOf(
        PropTypes.shape(
            {
                month: PropTypes.string.isRequired,
                count: PropTypes.number.isRequired,
            },
        ),
    ).isRequired,
};

export default ClientsByMonthCard;
