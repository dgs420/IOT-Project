// src/features/vehicle-type/Components/VehicleTypeTable.jsx
import React from 'react';
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {AlertCircle, Edit, Trash2} from 'lucide-react';

// Separate component for empty state
const EmptyState = () => (
    <TableRow>
        <TableCell colSpan={5} align="center">
            <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                <AlertCircle size={18} style={{marginRight: 8}}/>
                <Typography>No vehicle types found</Typography>
            </Box>
        </TableCell>
    </TableRow>
);

// Separate component for table row
const VehicleTypeRow = ({vehicleType, onEdit, onDelete}) => (
    <TableRow key={vehicleType.vehicle_type_id}>
        <TableCell>{vehicleType.vehicle_type_id}</TableCell>
        <TableCell>{vehicleType.vehicle_type_name}</TableCell>
        <TableCell>{vehicleType.description}</TableCell>
        <TableCell>${vehicleType.fee_per_hour.toFixed(2)}</TableCell>
        <TableCell className=" flex justify-between">
            <IconButton color="primary" onClick={() => onEdit(vehicleType)}>
                <Edit size={18}/>
            </IconButton>
            <IconButton color="error" onClick={() => onDelete(vehicleType)}>
                <Trash2 size={18}/>
            </IconButton>
        </TableCell>
    </TableRow>
);

const VehicleTypeTable = ({vehicleTypes, onEdit, onDelete}) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="vehicle types table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: "bold"}}>ID</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>Vehicle Type Name</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>Description</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>Fee Per Hour ($)</TableCell>
                        <TableCell sx={{fontWeight: "bold"}}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {vehicleTypes.length > 0 ? (
                        vehicleTypes.map((vehicleType) => (
                            <VehicleTypeRow
                                key={vehicleType.vehicle_type_id}
                                vehicleType={vehicleType}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <EmptyState/>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VehicleTypeTable;