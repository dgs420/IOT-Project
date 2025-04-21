import React, {useState} from 'react';

import VehicleTypeHeader from './components/VehicleTypeHeader';
import VehicleTypeTable from './components/VehicleTypeTable';
import VehicleTypeForm from "./components/VehicleTypeForm.jsx";
import {ConfirmModal} from "../../common/components/ConfirmModal.jsx";
import {useVehicleType} from "../../hooks/useVehicleType.js";
import Loading from "../../common/components/Loading.jsx";

const VehicleTypeAdmin = () => {
    // Use the custom hook for vehicle type operations
    const {
        vehicleTypes,
        isLoading,
        initialVehicleType,
        addVehicleType,
        updateVehicleType,
        deleteVehicleType,
        validateVehicleType
    } = useVehicleType();

    // Local UI state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentVehicleType, setCurrentVehicleType] = useState(initialVehicleType);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Form handling
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

    // Form submission
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

    // Delete handling
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
        <div className="bg-white rounded-lg shadow">
            <VehicleTypeHeader onAddNew={handleAddNew}/>
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
        </div>
    );
};

export default VehicleTypeAdmin;