import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { gridSpacing } from '../../store/constant';

const useStyles = makeStyles({
    table: {
        minWidth: 350,
    },
});

const TopCategoriesCard = ({ title, data }) => {
    const classes = useStyles();

    return (
        <Grid container spacing={ gridSpacing }>
            <Grid item xs={ 12 }>
                <Card>
                    <CardHeader
                        title={
                            <Typography component='div' className='card-header'>
                                { title }
                            </Typography>
                        }
                    />
                    <Divider />
                    <CardContent className='p-0'>
                        <TableContainer>
                            <Table className={ classes.table } aria-label='simple table'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Posición</TableCell>
                                        <TableCell>Categoría</TableCell>
                                        <TableCell>Servicio</TableCell>
                                        <TableCell>Cantidad</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        // eslint-disable-next-line react/prop-types
                                        data?.map((row, index) => (
                                            <TableRow key={ row.id }>
                                                <TableCell>{ index + 1 }</TableCell>
                                                <TableCell>{ row.category }</TableCell>
                                                <TableCell>{ row.service }</TableCell>
                                                <TableCell>{ row.count }</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

TopCategoriesCard.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.shape({
        id: PropTypes.number.isRequired,
        category: PropTypes.string.isRequired,
        service: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    }).isRequired,
};

export default TopCategoriesCard;
