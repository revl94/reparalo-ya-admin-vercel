import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';

const AlertDialog = ({ open, handleClose, title, content, agreeButtonText, disagreeButtonText }) => (
    <Dialog open={ open } onClose={ () => handleClose(false) } aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>{ title }</DialogTitle>
        <DialogContent>
            <DialogContentText id='alert-dialog-description'>
                { content }
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={ () => handleClose(false) } color='primary'>
                { disagreeButtonText }
            </Button>
            <Button onClick={ () => handleClose(true) } color='primary' autoFocus>
                { agreeButtonText }
            </Button>
        </DialogActions>
    </Dialog>
);

AlertDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    agreeButtonText: PropTypes.string.isRequired,
    disagreeButtonText: PropTypes.string.isRequired,
};

export default AlertDialog;
