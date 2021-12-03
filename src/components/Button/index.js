import React from 'react';
import MuiButton from '@material-ui/core/Button';

const Button = (props) => {
    const { ...rest } = props;

    return <MuiButton { ...rest } />;
};

export default Button;
