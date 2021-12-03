import React from 'react';
import MuiSwitch from '@material-ui/core/Switch';

const Switch = (props) => {
    const { ...rest } = props;

    return <MuiSwitch { ...rest } />;
};

export default Switch;
