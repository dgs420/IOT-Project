// src/features/vehicle-type/hooks/useVehicleType.js
import {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import {fetchData} from "../api/fetchData.js";
import {deleteRequest, postRequest, putRequest} from "../api/index.js";

export const useVehicleType = () => {
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial empty state for a vehicle type
    const initialVehicleType = {
        vehicle_type_id: null,
        vehicle_type_name: '',
        description: '',
        fee_per_hour: 0
    };

    // Load data
    const loadVehicleTypes = async () => {
        setIsLoading(true);
        try {
            await fetchData('/vehicle-type', setVehicleTypes, null, null);
        } catch (err) {
            setError(err);
            toast.error('Failed to load vehicle types');
        } finally {
            setIsLoading(false);
        }
    };

    // Load on mount
    useEffect(() => {
        void loadVehicleTypes();
    }, []);

    // Add a new vehicle type
    const addVehicleType = async (vehicleType) => {
        try {
            const response = await postRequest(
                '/vehicle-type/create',
                vehicleType
            )
            if (response.code !== 200) {
                toast.error(response.message || 'Failed to add vehicle type');
            } else {
                const newVehicleType = response.info;
                setVehicleTypes([...vehicleTypes, newVehicleType]);
                toast.success('Vehicle type added successfully');
            }
            return true;
        } catch (error) {
            toast.error('Failed to add vehicle type');
            return false;
        }
    };

    // Update an existing vehicle type
    const updateVehicleType = async (vehicleType) => {
        try {
            const response = await putRequest('/vehicle-type/update', vehicleType);
            if (response.code !== 200) {
                toast.error(response.message || 'Failed to delete vehicle type');
                return false;
            } else {
                setVehicleTypes(vehicleTypes.map(item =>
                    item.vehicle_type_id === vehicleType.vehicle_type_id
                        ? vehicleType
                        : item
                ));
                toast.success('Vehicle type updated successfully');
                return true;
            }
        } catch (error) {
            toast.error('Failed to update vehicle type');
            return false;
        }
    };

    // Delete a vehicle type
    const deleteVehicleType = async (vehicleTypeId) => {
        try {
            const response = await deleteRequest(`/vehicle-type/delete/${vehicleTypeId}`);
            if (response.code !== 200) {
                toast.error(response.message || 'Failed to delete vehicle type');
                return false;
            } else {
                setVehicleTypes(vehicleTypes.filter(
                    item => item.vehicle_type_id !== vehicleTypeId
                ));
                toast.success('Vehicle type deleted successfully');
                return true;

            }
        } catch (error) {
            toast.error('Failed to delete vehicle type');
            return false;
        }
    };

    // Validate a vehicle type
    const validateVehicleType = (vehicleType) => {
        const errors = {};
        if (!vehicleType.vehicle_type_name.trim()) {
            errors.vehicle_type_name = 'Vehicle type name is required';
        }
        if (vehicleType.fee_per_hour < 0) {
            errors.fee_per_hour = 'Fee per hour must be a positive number';
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    };

    return {
        vehicleTypes,
        isLoading,
        error,
        initialVehicleType,
        addVehicleType,
        updateVehicleType,
        deleteVehicleType,
        validateVehicleType,
        refreshVehicleTypes: loadVehicleTypes
    };
};