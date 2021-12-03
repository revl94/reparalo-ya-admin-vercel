import { Dialog, Slide } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const Transition = React.forwardRef((props, ref) => <Slide direction='left' ref={ ref } { ...props } />);

const SideBarDialog = ({
                           open,
                           children,
                           handleCloseDialog,
                           dialogClass,
                       }) => (
    <Dialog
        open={ open }
        TransitionComponent={ Transition }
        keepMounted
        onClose={ handleCloseDialog }
        className={ dialogClass }
    >
        { children }
    </Dialog>
);

SideBarDialog.propTypes = {
    open: PropTypes.bool,
    handleCloseDialog: PropTypes.func,
    dialogClass: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func,
        PropTypes.elementType,
    ]).isRequired,
};

SideBarDialog.defaultProps = {
    open: false,
    handleCloseDialog: null,
    dialogClass: null,
};

export default SideBarDialog;
