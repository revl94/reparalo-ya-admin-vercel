import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    button: {
        paddingLeft: theme.spacing(1),
    },
    circularProgress: {
        marginLeft: 0,
        marginRight: theme.spacing(1),
    },
});

function LoadingButton({ classes, loading, startIcon, children, ...rest }) {
    return (
            <Button { ...rest } className={ classes.button } startIcon={ !loading ? startIcon : null }>
                { loading && <CircularProgress className={ classes.circularProgress } size={ 20 } /> }
                { children }
            </Button>
    );
}

LoadingButton.propTypes = {
    classes: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]).isRequired,
    startIcon: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]),
};

LoadingButton.defaultProps = {
    loading: true,
    startIcon: null,
};

export default withStyles(styles)(LoadingButton);
