import React from 'react';
import PropTypes from 'prop-types';

const MinimalLayout = ({ children }) => <>{ children }</>;

MinimalLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]).isRequired,
};

export default MinimalLayout;
