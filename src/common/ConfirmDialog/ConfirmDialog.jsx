import React from 'react';

import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    Button,
    DialogContentText
} from "@material-ui/core";

const ConfirmDialog = ({ openDialog, setOpenDialog, title, message, handleSubmit }) => {
    return (
        <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleSubmit(false)} color="primary">
                    Disagree
                </Button>
                <Button onClick={() => handleSubmit(true)} color="primary" autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog