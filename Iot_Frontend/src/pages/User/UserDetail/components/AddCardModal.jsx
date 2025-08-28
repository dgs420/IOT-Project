import { Box, Button, MenuItem, Modal, TextField } from "@mui/material";
import React from "react";
import propTypes from "prop-types";
import { useVehicleTypeStore } from "../../../../store/useVehicleTypeStore.js";
import { CustomButton } from "../../../../common/components/CustomButton.jsx";

const AddCardModal = ({
  open,
  onClose,
  onReadCard,
  newCard,
  onInputChange,
  onSubmit,
}) => {
  const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);
  const handleReadCard = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    onReadCard();
  };
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
        <h2 className="text-xl font-semibold">Add New Vehicle</h2>
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
          <CustomButton
            onClick={(e) => {
              // Modify this
              e.preventDefault();
              onReadCard();
            }}
            color="success"
            className="w-full items-center justify-center"
            title="Start reading card"
          />
          <TextField
            label="Vehicle Lisence Plate"
            name="vehicle_plate"
            value={newCard.vehicle_plate}
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
                <MenuItem
                  key={type.vehicle_type_id}
                  value={type.vehicle_type_id}
                >
                  {type.vehicle_type_name}
                </MenuItem>
              ))
            )}
          </TextField>
          {/* <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Add Vehicle
                    </Button> */}
          <CustomButton
            // @ts-ignore
            type="submit"
            color="primary"
            className="w-full items-center justify-center"
            title="Add vehicle"
          />
        </form>
      </Box>
    </Modal>
  );
};


export default AddCardModal;
