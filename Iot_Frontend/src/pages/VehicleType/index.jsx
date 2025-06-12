import React, {useState} from 'react';

import VehicleTypeTable from './components/VehicleTypeTable';
import VehicleTypeForm from "./components/VehicleTypeForm.jsx";
import {ConfirmModal} from "../../common/components/ConfirmModal.jsx";
import {useVehicleType} from "../../hooks/useVehicleType.js";
import Loading from "../../common/components/Loading.jsx";
import PageContentHeader from "../../common/components/PageContentHeader.jsx";
import {Box} from "@mui/material"

const VehicleTypeAdmin = () => {
    const {
        vehicleTypes,
        isLoading,
        initialVehicleType,
        addVehicleType,
        updateVehicleType,
        deleteVehicleType,
        validateVehicleType
    } = useVehicleType();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentVehicleType, setCurrentVehicleType] = useState(initialVehicleType);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const handleAddNew = () => {
        setCurrentVehicleType(initialVehicleType);
        setFormErrors({});
        setIsEditMode(false);
        setIsFormOpen(true);
    };

    const handleEdit = (vehicleType) => {
        setCurrentVehicleType({...vehicleType});
        setFormErrors({});
        setIsEditMode(true);
        setIsFormOpen(true);
    };

    const handleFormClose = () => setIsFormOpen(false);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setCurrentVehicleType({
            ...currentVehicleType,
            [name]: name === 'fee_per_hour' ? parseFloat(value) || 0 : value
        });
    };

    const handleSubmit = () => {
        const {isValid, errors} = validateVehicleType(currentVehicleType);

        if (!isValid) {
            setFormErrors(errors);
            return;
        }

        const success = isEditMode
            ? updateVehicleType(currentVehicleType)
            : addVehicleType(currentVehicleType);

        if (success) {
            handleFormClose();
        }
    };

    const handleDeleteConfirm = (vehicleType) => {
        setCurrentVehicleType(vehicleType);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        const success = deleteVehicleType(currentVehicleType.vehicle_type_id);
        if (success) {
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <Box>
            <PageContentHeader
                label="Vehicle Types"
                description="Manage vehicle types and their associated fees."
                buttonLabel='Add Vehicle Type'
                onClick={handleAddNew}
                className="mb-4"
            />
            {
                isLoading ? (
                    <Loading/>
                ) : (
                    <VehicleTypeTable
                        vehicleTypes={vehicleTypes}
                        onEdit={handleEdit}
                        onDelete={handleDeleteConfirm}
                    />
                )
            }

            <VehicleTypeForm
                open={isFormOpen}
                onClose={handleFormClose}
                onSubmit={handleSubmit}
                vehicleType={currentVehicleType}
                formErrors={formErrors}
                onInputChange={handleInputChange}
                isEdit={isEditMode}
            />

            <ConfirmModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Vehicle Type"
                message={`Are you sure you want to delete the vehicle type "${currentVehicleType.vehicle_type_name}"? This action cannot be undone.`}
            />
        </Box>
    );
};

export default VehicleTypeAdmin;