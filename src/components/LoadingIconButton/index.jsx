import { Box, CircularProgress, IconButton, Tooltip } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { green } from '@material-ui/core/colors';

const LoadingIconButton = ({ color, children, onClick, loading, progressColor, tooltipLabel }) => (
    <Box sx={ { margin: 0, position: 'relative' } }>
        <Tooltip title={ tooltipLabel }>
            <IconButton color={ color } onClick={ () => onClick() }>
                { children }
            </IconButton>
        </Tooltip>
        { loading && (
            <CircularProgress
                size={ 44 }
                style={ {
                    color: progressColor,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                } }
            />
        ) }
    </Box>
);

LoadingIconButton.propTypes = {
    color: PropTypes.string,
    progressColor: PropTypes.string,
    loading: PropTypes.bool,
    tooltipLabel: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]).isRequired,
    onClick: PropTypes.func.isRequired,
};

LoadingIconButton.defaultProps = {
    color: 'primary',
    progressColor: green[500],
    loading: false,
    tooltipLabel: '',
};

export default LoadingIconButton;
