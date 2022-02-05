import React from 'react';
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { gridSpacing } from '../../constants/constant';
import TopCategoriesCard from './TopCategoriesCard';
import InfoCard from '../../components/Charts/InfoCard';
import useRequestsPerStatus from '../../hooks/useRequestsPerStatus';
import useSummary from '../../hooks/useSummary';
import useRequestsGroupByMonth from '../../hooks/useRequestsGroupByMonth';
import useClientsGroupByMonth from '../../hooks/useClientsGroupByMonth';
import RequestsByMonthCard from './RequestsByMonthCard';
import ClientsByMonthCard from './ClientsByMonthCard';
import RequestsPerStatusCard from './RequestsPerStatusCard';
import useTopCategories from '../../hooks/useTopCategories';

const Dashboard = () => {
    const theme = useTheme();
    const [{ summary, isLoading: isLoadingSummary }] = useSummary();
    const [{ requestsPerStatus }] = useRequestsPerStatus();
    const [{ requestsByMonth }, getRequestsByMonth] = useRequestsGroupByMonth();
    const [{ clientsByMonth }] = useClientsGroupByMonth();
    const [{ topCategories }] = useTopCategories();

    return (
        <Grid container spacing={ gridSpacing }>
            <Grid item xs={ 12 }>
                <Grid container spacing={ gridSpacing }>
                    <Grid item lg={ 3 } sm={ 6 } xs={ 12 }>
                        <InfoCard
                            value={ isLoadingSummary ? '-' : summary?.clients || 0 }
                            title='Clientes'
                            color={ theme.palette.warning.main }
                            subTitle='Total de clientes registrados'
                            iconPrimary={ PeopleAltIcon }
                        />
                    </Grid>
                    <Grid item lg={ 3 } sm={ 6 } xs={ 12 }>
                        <InfoCard
                            value={ isLoadingSummary ? '-' : summary?.activeServices || 0 }
                            title='Servicios'
                            color={ theme.palette.info.main }
                            subTitle='Servicios habilitados'
                            iconPrimary={ LocalLaundryServiceIcon }
                        />
                    </Grid>
                    <Grid item lg={ 3 } sm={ 6 } xs={ 12 }>
                        <InfoCard
                            value={ isLoadingSummary ? '-' : summary?.activeCategories || 0 }
                            title='Categorías'
                            color={ theme.palette.success.main }
                            subTitle='Categorías activas'
                            iconPrimary={ LocalLaundryServiceIcon }
                        />
                    </Grid>
                    <Grid item lg={ 3 } sm={ 6 } xs={ 12 }>
                        <InfoCard
                            value={ isLoadingSummary ? '-' : summary?.activeDiscounts || 0 }
                            title='Descuentos'
                            color={ theme.palette.primary.main }
                            subTitle='Descuentos del mes'
                            iconPrimary={ LocalOfferIcon }
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={ 12 }>
                <Grid container spacing={ gridSpacing }>
                    <Grid item xs={ 12 } sm={ 8 }>
                        <Grid container spacing={ gridSpacing } direction='column'>
                            <Grid item xs={ 12 }>
                                <ClientsByMonthCard
                                    clientsByMonth={ clientsByMonth }
                                />
                            </Grid>
                            <Grid item xs={ 12 }>
                                <RequestsByMonthCard
                                    requestsByMonth={ requestsByMonth }
                                    getRequestsByMonth={ getRequestsByMonth }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={ 12 } sm={ 4 }>
                        <RequestsPerStatusCard requestsPerStatus={ requestsPerStatus } />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={ 12 }>
                <TopCategoriesCard title='Top 5 Categorías del Mes'
                                   data={ topCategories }
                />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
