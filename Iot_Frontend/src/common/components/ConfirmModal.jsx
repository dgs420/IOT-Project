import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";
import { CustomButton } from "./CustomButton";

export const ConfirmModal = ({ open, onClose, onConfirm, title, message }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{message}</p>
            </DialogContent>
            <DialogActions>
                <CustomButton color="danger" onClick={onClose} title="Cancel" />
                <CustomButton color="primary" onClick={onConfirm} title="Confirm" />
            </DialogActions>
        </Dialog>
    );
};