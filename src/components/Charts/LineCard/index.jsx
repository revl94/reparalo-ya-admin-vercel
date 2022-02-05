import React from 'react';
import { useTheme } from '@material-ui/styles';
import Chart from 'react-apexcharts';

import { Box, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    content: {
        padding: 0,
        paddingBottom: '0 !important',
    },
}));

const LineCard = ({ bgColor, chartData, footerData, icon, title, percentage, children }) => {
    const classes = useStyles();
    const theme = useTheme();

    let footerHtml;

    if (footerData) {
        // eslint-disable-next-line react/prop-types
        footerHtml = footerData.map(item => (
            <Grid item key={ item.label }>
                <Box mt={ 3 } mb={ 3 } p={ 1 }>
                    <Grid container direction='column' spacing={ 1 } alignItems='center'>
                        <Typography variant='h4'>{ item.value }</Typography>
                        <Typography variant='subtitle2' color='secondary'>
                            { item.label }
                        </Typography>
                    </Grid>
                </Box>
            </Grid>
        ));
    }

    return (
        <Card>
            <CardContent className={ classes.content }>
                <Box color='#fff' bgcolor={ bgColor || theme.palette.primary.main } p={ 3 }>
                    <Grid container direction='column' spacing={ 1 }>
                        <Grid item container justifyContent='space-between' alignItems='center'>
                            { title && (
                                <Grid item>
                                    <Typography variant='subtitle1' color='inherit'>
                                        { title }
                                    </Typography>
                                </Grid>
                            ) }
                            <Grid item>
                                <Grid container alignItems='center'>
                                    { icon && (
                                        <Box component='span' mr={ 2 }>
                                            { icon }
                                        </Box>
                                    ) }
                                    { percentage && (
                                        <Typography variant='subtitle1' color='inherit'>
                                            { percentage }
                                        </Typography>
                                    ) }
                                    { children }
                                </Grid>
                            </Grid>
                        </Grid>
                        { chartData && (
                            <Grid item>
                                <Chart { ...chartData } />
                            </Grid>
                        ) }
                    </Grid>
                </Box>
                { footerData && (
                    <Grid container justifyContent='space-around' alignItems='center'>
                        { footerHtml }
                    </Grid>
                ) }
            </CardContent>
        </Card>
    );
};


LineCard.propTypes = {
    bgColor: PropTypes.string.isRequired,
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    percentage: PropTypes.number,
    footerData: PropTypes.shape({
        value: PropTypes.oneOfType(
            [
                PropTypes.string,
                PropTypes.number,
            ],
        ),
        label: PropTypes.string,
    }),
    chartData: PropTypes.shape({
        height: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        // eslint-disable-next-line react/forbid-prop-types
        series: PropTypes.array.isRequired,
        options: PropTypes.shape({}),
    }).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]),
};

LineCard.defaultProps = {
    footerData: null,
    percentage: null,
    icon: null,
    children: null,
};

export default LineCard;
