import React from 'react';
import MuiBadge from '@material-ui/core/Badge';
import PropTypes from 'prop-types';

const Badge = (props) => {
    const { color, ...rest } = props;

    return <MuiBadge { ...rest } color={ color } />;
};

Badge.propTypes = {
    color: PropTypes.string,
};

Badge.defaultProps = {
    color: 'primary',
};

export default Badge;
