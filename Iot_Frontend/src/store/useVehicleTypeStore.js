import { create } from 'zustand';

export const useVehicleTypeStore = create((set, get) => ({
    vehicleTypes: [],
    setVehicleTypes: (types) => set({ vehicleTypes: types }),
    getTypeNameById: (id) => {
        const types = get().vehicleTypes;
        return types.find((type) => type.vehicle_type_id === id)?.vehicle_type_name || 'Unknown';
    },
}));
