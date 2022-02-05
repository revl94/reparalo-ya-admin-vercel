import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const PieCard = ({ chartData, title, height }) => (
    <Card style={ { height } }>
        <CardHeader
            title={
                <Typography t='div' className='card-header'>
                    { title }
                </Typography>
            }
        />
        <Divider />
        <CardContent>
            <Grid container>
                <Grid item xs={ 12 }>
                    <Chart { ...chartData } />
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

PieCard.propTypes = {
    chartData: PropTypes.shape({
        height: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        // eslint-disable-next-line react/forbid-prop-types
        series: PropTypes.array.isRequired,
        options: PropTypes.shape({}),
    }).isRequired,
    title: PropTypes.string.isRequired,
    height: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

PieCard.defaultProps = {
    height: '100%',
};

export default PieCard;
