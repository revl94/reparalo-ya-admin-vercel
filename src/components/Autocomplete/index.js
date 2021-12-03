import React from 'react';
import MuiAutocomplete from '@material-ui/lab/Autocomplete';

const Alert = (props) => {
    const { ...rest } = props;

    return <MuiAutocomplete { ...rest } />;
};

export default Alert;
