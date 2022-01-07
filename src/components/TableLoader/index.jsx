import React from 'react';
import { CircularProgress } from '@material-ui/core';

const TableLoader = () => <CircularProgress size={ 24 } style={ { marginLeft: 15, position: 'relative', top: 4 } } />;

export default TableLoader;
