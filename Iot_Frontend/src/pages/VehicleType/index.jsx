import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    IconButton,
    Box
} from '@mui/material';
import { Edit, Trash2, Plus, X, Save, AlertCircle } from 'lucide-react';

// Mock data for demonstration
const initialMockData = [
    {
        vehicle_type_id: 1,
        vehicle_type_name: 'Sedan',
        description: 'A standard 4-door passenger car',
        fee_per_hour: 25.50,
    },
    {
        vehicle_type_id: 2,
        vehicle_type_name: 'SUV',
        description: 'Sport Utility Vehicle with additional space',
        fee_per_hour: 35.00,
    },
    {
        vehicle_type_id: 3,
        vehicle_type_name: 'Van',
        description: 'Large vehicle for transporting groups or cargo',
        fee_per_hour: 40.75,
    },
    {
        vehicle_type_id: 4,
        vehicle_type_name: 'Truck',
        description: 'Pickup truck for hauling',
        fee_per_hour: 45.00,
    }
];

const VehicleTypeAdmin = () => {
    // State management
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [currentVehicleType, setCurrentVehicleType] = useState({
        vehicle_type_id: null,
        vehicle_type_name: '',
        description: '',
        fee_per_hour: 0
    });
    const [formErrors, setFormErrors] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Load mock data on component mount
    useEffect(() => {
        setVehicleTypes(initialMockData);
    }, []);

    // Handle dialog open for adding new vehicle type
    const handleAddNew = () => {
        setCurrentVehicleType({
            vehicle_type_id: null,
            vehicle_type_name: '',
            description: '',
            fee_per_hour: 0
        });
        setFormErrors({});
        setIsEdit(false);
        setOpen(true);
    };

    // Handle dialog open for editing vehicle type
    const handleEdit = (vehicleType) => {
        setCurrentVehicleType({ ...vehicleType });
        setFormErrors({});
        setIsEdit(true);
        setOpen(true);
    };

    // Handle dialog close
    const handleClose = () => {
        setOpen(false);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentVehicleType({
            ...currentVehicleType,
            [name]: name === 'fee_per_hour' ? parseFloat(value) || 0 : value
        });
    };

    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!currentVehicleType.vehicle_type_name.trim()) {
            errors.vehicle_type_name = 'Vehicle type name is required';
        }
        if (currentVehicleType.fee_per_hour < 0) {
            errors.fee_per_hour = 'Fee per hour must be a positive number';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submit (add or update vehicle type)
    const handleSubmit = () => {
        if (!validateForm()) return;

        try {
            if (isEdit) {
                // Update existing vehicle type
                setVehicleTypes(vehicleTypes.map(item =>
                    item.vehicle_type_id === currentVehicleType.vehicle_type_id
                        ? currentVehicleType
                        : item
                ));
                showSnackbar('Vehicle type updated successfully');
            } else {
                // Add new vehicle type
                const newVehicleType = {
                    ...currentVehicleType,
                    vehicle_type_id: Math.max(...vehicleTypes.map(item => item.vehicle_type_id), 0) + 1
                };
                setVehicleTypes([...vehicleTypes, newVehicleType]);
                showSnackbar('Vehicle type added successfully');
            }
            handleClose();
        } catch (error) {
            showSnackbar('Operation failed', 'error');
        }
    };

    // Handle delete confirmation dialog open
    const handleDeleteConfirm = (vehicleType) => {
        setCurrentVehicleType(vehicleType);
        setDeleteConfirmOpen(true);
    };

    // Handle delete confirmation dialog close
    const handleDeleteConfirmClose = () => {
        setDeleteConfirmOpen(false);
    };

    // Handle delete vehicle type
    const handleDelete = () => {
        try {
            setVehicleTypes(vehicleTypes.filter(
                item => item.vehicle_type_id !== currentVehicleType.vehicle_type_id
            ));
            showSnackbar('Vehicle type deleted successfully');
            handleDeleteConfirmClose();
        } catch (error) {
            showSnackbar('Delete operation failed', 'error');
        }
    };

    // Show snackbar
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    // Handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Vehicle Types Management
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={18} />}
                    onClick={handleAddNew}
                >
                    Add New Vehicle Type
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="vehicle types table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Vehicle Type Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Fee Per Hour ($)</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicleTypes.length > 0 ? (
                            vehicleTypes.map((vehicleType) => (
                                <TableRow key={vehicleType.vehicle_type_id}>
                                    <TableCell>{vehicleType.vehicle_type_id}</TableCell>
                                    <TableCell>{vehicleType.vehicle_type_name}</TableCell>
                                    <TableCell>{vehicleType.description}</TableCell>
                                    <TableCell>${vehicleType.fee_per_hour.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(vehicleType)}>
                                            <Edit size={18} />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteConfirm(vehicleType)}>
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                                        <AlertCircle size={18} style={{ marginRight: 8 }} />
                                        <Typography>No vehicle types found</Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    {isEdit ? 'Edit Vehicle Type' : 'Add New Vehicle Type'}
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <X size={18} />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="vehicle_type_name"
                        label="Vehicle Type Name"
                        type="text"
                        fullWidth
                        value={currentVehicleType.vehicle_type_name}
                        onChange={handleInputChange}
                        error={!!formErrors.vehicle_type_name}
                        helperText={formErrors.vehicle_type_name}
                        sx={{ mb: 2, mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={3}
                        value={currentVehicleType.description || ''}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="fee_per_hour"
                        label="Fee Per Hour ($)"
                        type="number"
                        fullWidth
                        value={currentVehicleType.fee_per_hour}
                        onChange={handleInputChange}
                        error={!!formErrors.fee_per_hour}
                        helperText={formErrors.fee_per_hour}
                        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} startIcon={<X size={18} />}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" startIcon={<Save size={18} />}>
                        {isEdit ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteConfirmClose}
            >
                <DialogTitle>Delete Vehicle Type</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the vehicle type "{currentVehicleType.vehicle_type_name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default VehicleTypeAdmin;