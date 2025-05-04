"use client"

import { useState } from "react"
import {
    Grid,
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
} from "@mui/material"
import { AlertCircle, Trash2 } from "lucide-react"
import ParkingSpaceItem from "./ParkingSpaceItem"

const ParkingSpaceList = ({ spaces, vehicleTypes, loading, onEdit, onDelete }) => {
    const theme = useTheme()
    const [deleteDialog, setDeleteDialog] = useState({ open: false, space: null })

    const getVehicleType = (vehicleTypeId) => {
        return vehicleTypes.find((type) => type.vehicle_type_id === vehicleTypeId) || null
    }

    const handleDeleteClick = (space) => {
        setDeleteDialog({ open: true, space })
    }

    const handleConfirmDelete = () => {
        if (deleteDialog.space) {
            onDelete(deleteDialog.space.space_id)
            setDeleteDialog({ open: false, space: null })
        }
    }

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, space: null })
    }

    if (loading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading parking spaces...
                </Typography>
            </Box>
        )
    }

    if (spaces.length === 0) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
                <AlertCircle size={60} color={theme.palette.text.secondary} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    No parking spaces found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Add a new parking space to get started
                </Typography>
            </Box>
        )
    }

    return (
        <>
            <Grid container spacing={3}>
                {spaces.map((space) => (
                    <Grid item xs={12} sm={6} md={4} key={space.space_id}>
                        <ParkingSpaceItem
                            space={space}
                            vehicleType={getVehicleType(space.vehicle_type_id)}
                            onEdit={() => onEdit(space)}
                            onDelete={handleDeleteClick}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this parking space?</Typography>
                    {deleteDialog.space?.occupied_spaces > 0 && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Cannot delete parking space with occupied spots.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleCloseDeleteDialog}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleConfirmDelete}
                        startIcon={<Trash2 size={18} />}
                        disabled={deleteDialog.space?.occupied_spaces > 0}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ParkingSpaceList
