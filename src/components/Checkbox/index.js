import React from 'react';
import MuiCheckbox from '@material-ui/core/Checkbox';

const Checkbox = (props) => {
    const { ...rest } = props;

    return <MuiCheckbox { ...rest } />;
};

export default Checkbox;
