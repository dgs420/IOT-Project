// src/features/vehicle-type/hooks/useVehicleType.js
import { toast } from 'react-toastify';
import { deleteRequest, postRequest, putRequest } from '../api';
import {useVehicleTypeStore} from "../store/useVehicleTypeStore.js";

export const useVehicleType = () => {
    const vehicleTypes = useVehicleTypeStore((state) => state.vehicleTypes);
    const setVehicleTypes = useVehicleTypeStore((state) => state.setVehicleTypes);

    const initialVehicleType = {
        vehicle_type_id: null,
        vehicle_type_name: '',
        description: '',
        fee_per_hour: 0,
    };

    const addVehicleType = async (vehicleType) => {
        try {
            const response = await postRequest('/vehicle-type/create', vehicleType);
            if (response.code !== 200) {
                toast.error(response.message || 'Failed to add vehicle type');
                return false;
            }
            setVehicleTypes([...vehicleTypes, response.info]);
            toast.success('Vehicle type added successfully');
            return true;
        } catch (error) {
            toast.error('Failed to add vehicle type', error);
            return false;
        }
    };

    const updateVehicleType = async (vehicleType) => {
        try {
            const response = await putRequest('/vehicle-type/update', vehicleType);
            if (response.code !== 200) {
                toast.error(response.message || 'Failed to update vehicle type');
                return false;
            }
            const updated = vehicleTypes.map((item) =>
                item.vehicle_type_id === vehicleType.vehicle_type_id ? vehicleType : item
            );
            setVehicleTypes(updated);
            toast.success('Vehicle type updated successfully');
            return true;
        } catch (error) {
            toast.error('Failed to update vehicle type', error);
            return false;
        }
    };

    const deleteVehicleType = async (vehicleTypeId) => {
        try {
            const response = await deleteRequest(`/vehicle-type/delete/${vehicleTypeId}`);
            if (response.code !== 200) {
                toast.error(response.message || 'Failed to delete vehicle type');
                return false;
            }
            setVehicleTypes(vehicleTypes.filter((v) => v.vehicle_type_id !== vehicleTypeId));
            toast.success('Vehicle type deleted successfully');
            return true;
        } catch (error) {
            toast.error('Failed to delete vehicle type', error);
            return false;
        }
    };

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
            errors,
        };
    };

    return {
        vehicleTypes,
        initialVehicleType,
        addVehicleType,
        updateVehicleType,
        deleteVehicleType,
        validateVehicleType,
    };
};
