import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";

export const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{message}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={onConfirm} color="primary">Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};