import React from 'react';
import { VehicleItem } from './VehicleItem';
import { EmptyVehicleList } from './EmptyVehicleList';

export const VehicleList = ({
                              vehicles,
                              searchQuery,
                              statusFilter,
                              onEditCard,
                              onDeleteCard,
                              onAddNewCard
                          }) => {
    const filteredVehicles = vehicles.filter(vehicle => {
        const matchesSearch =
            vehicle.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || vehicle.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const searchActive = searchQuery || statusFilter !== 'all';

    return (
        <div className="p-6">
            {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => (
                        <VehicleItem
                            key={vehicle.vehicle_id}
                            card={vehicle}
                            onEdit={onEditCard}
                            onDelete={onDeleteCard}
                        />
                    ))}
                </div>
            ) : (
                <EmptyVehicleList
                    searchActive={searchActive}
                    onAddNewCard={onAddNewCard}
                />
            )}
        </div>
    );
};
