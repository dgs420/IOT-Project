import {Box, Button, MenuItem, Modal, TextField} from "@mui/material";
import React from "react";
import propTypes from "prop-types";
import {useVehicleTypeStore} from "../../../../store/useVehicleTypeStore.js";


const AddCardModal = ({ open, onClose, newCard, onInputChange, onSubmit }) => {
    const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 400,
                    bgcolor: "background.paper",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <h2>Add New Vehicle</h2>
                <form onSubmit={onSubmit}>
                    <TextField
                        label="Card Number"
                        name="card_number"
                        value={newCard.card_number}
                        onChange={onInputChange}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Vehicle Number"
                        name="vehicle_number"
                        value={newCard.vehicle_number}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Vehicle Type"
                        name="vehicle_type_id"
                        value={newCard.vehicle_type_id}
                        onChange={onInputChange}
                        fullWidth
                        margin="normal"
                    >
                        {vehicleTypes.length === 0 ? (
                            <MenuItem disabled>No vehicle types available</MenuItem>
                        ) : (
                            vehicleTypes.map((type) => (
                                <MenuItem key={type.vehicle_type_id} value={type.vehicle_type_id}>
                                    {type.vehicle_type_name}
                                </MenuItem>
                            ))
                        )}
                    </TextField>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Add Vehicle
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

AddCardModal.propTypes = {
    open: propTypes.bool.isRequired,
    onClose: propTypes.func.isRequired,
    newCard: propTypes.shape({
        card_number: propTypes.string.isRequired,
        vehicle_number: propTypes.string.isRequired,
        vehicle_type_id: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
    }).isRequired,
    onInputChange: propTypes.func.isRequired,
    onSubmit: propTypes.func.isRequired,
};

export default AddCardModal;