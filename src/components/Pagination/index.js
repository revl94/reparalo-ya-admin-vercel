import React from 'react';
import MuiPagination from '@material-ui/lab/Pagination';

const Pagination = (props) => {
    const { ...rest } = props;

    return <MuiPagination { ...rest } />;
};

export default Pagination;
