import React from 'react';

import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    Button,
    DialogContentText
} from "@material-ui/core";

const ConfirmDialog = ({ openDialog, setOpenDialog, title, message, handleSubmit, cleanModal }) => {
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
            {!cleanModal && <DialogActions>
                <Button onClick={() => handleSubmit(false)} color="secondary" variant="contained">
                    NO
                </Button>
                <Button onClick={() => handleSubmit(true)} color="primary" autoFocus variant="contained">
                    YES
                </Button>
            </DialogActions>}
            {cleanModal && <DialogActions>
                <Button onClick={() => handleSubmit("close")} color="secondary" variant="contained">
                    CLOSE
                </Button>
                <Button onClick={() => handleSubmit("book")} color="primary" autoFocus variant="contained">
                    BOOK
                </Button>
                <Button onClick={() => handleSubmit("clean")} color="primary" autoFocus variant="contained">
                    CLEAN
                </Button>
            </DialogActions>}
        </Dialog>
    )
}

export default ConfirmDialog