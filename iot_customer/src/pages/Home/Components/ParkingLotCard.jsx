import React from "react";
import {LinearProgress, Paper} from "@mui/material";
import {useVehicleTypeStore} from "../../../store/useVehicleTypeStore.js";
import {VehicleIcon} from "../../../utils/VehicleIcon.jsx";

const ParkingLotCard = ({lot}) => {
    const {total_spaces, available_spaces, occupied_spaces, vehicle_type_id} = lot;
    const occupiedPercentage = (occupied_spaces / total_spaces) * 100;
    const freePercentage = 100 - occupiedPercentage;
    const getTypeNameById = useVehicleTypeStore((state) => state.getTypeNameById);

    // Set MUI color for progress bar
    let muiColor = "error";
    if (freePercentage > 50) muiColor = "success";
    else if (freePercentage > 20) muiColor = "warning";

    return (
        <Paper
            elevation={3}
            className="p-4 rounded-2xl flex flex-col gap-2 shadow-md"
        >
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <span className="w-6 h-6">{VehicleIcon(vehicle_type_id)}</span>
                <span className="font-medium">{getTypeNameById(vehicle_type_id)}</span>
            </div>

            <h2 className="text-lg font-semibold">
                {available_spaces} free / {total_spaces} total
            </h2>

            <LinearProgress
                variant="determinate"
                value={freePercentage}
                color={muiColor}
                sx={{height: 10, borderRadius: 5}}
            />

            <p
                className={`text-sm font-medium mt-1 ${
                    muiColor === "success"
                        ? "text-green-600"
                        : muiColor === "warning"
                            ? "text-yellow-600"
                            : "text-red-600"
                }`}
            >
                {freePercentage.toFixed(0)}% available
            </p>
        </Paper>
    );
};

export default ParkingLotCard;
