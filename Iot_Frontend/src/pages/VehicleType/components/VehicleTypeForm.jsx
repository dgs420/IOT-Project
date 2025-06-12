import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField
} from "@mui/material";
import { Save, X } from "lucide-react";
import {CustomButton} from "../../../common/components/CustomButton.jsx";

const VehicleTypeForm = ({
                             open,
                             isEdit,
                             onClose,
                             onSubmit,
                             vehicleType,
                             onInputChange,
                             formErrors
                         }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEdit ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <X size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <TextField
                    margin="dense"
                    name="vehicle_type_name"
                    label="Vehicle Type Name"
                    fullWidth
                    value={vehicleType.vehicle_type_name || ''}
                    onChange={onInputChange}
                    error={!!formErrors.vehicle_type_name}
                    helperText={formErrors.vehicle_type_name}
                    sx={{ mb: 2, mt: 2 }}
                />
                <TextField
                    margin="dense"
                    name="description"
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={vehicleType.description || ''}
                    onChange={onInputChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    name="fee_per_hour"
                    label="Fee Per Hour ($)"
                    type="number"
                    fullWidth
                    value={vehicleType.fee_per_hour}
                    onChange={onInputChange}
                    error={!!formErrors.fee_per_hour}
                    helperText={formErrors.fee_per_hour}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                />
            </DialogContent>

            <DialogActions>
                <CustomButton
                    onClick={onClose}
                    icon={<X size={18} />}
                    title='Cancel'
                    color='danger'
                />
                <CustomButton
                    onClick={onSubmit}
                    icon={<Save size={18} />}
                    title= {isEdit ? 'Update' : 'Save'}
                    color='success'
                />
            </DialogActions>
        </Dialog>
    );
};

export default VehicleTypeForm;
