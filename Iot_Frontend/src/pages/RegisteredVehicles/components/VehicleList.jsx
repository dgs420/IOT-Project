import React, { useEffect, useState } from "react";
import { VehicleItem } from "./VehicleItem";
import { EmptyVehicleList } from "./EmptyVehicleList";
import { toast } from "react-toastify";
import { getRequest } from "../../../api";

export const VehicleList = ({
  searchQuery,
  statusFilter,
  onEditCard,
  onDeleteCard,
  onAddNewCard,
  typeFilter,
}) => {
  const [vehicles, setVehicles] = useState([]);
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.vehicle_number
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      vehicle.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType =
      typeFilter === "all" || vehicle.vehicle_type_id === parseInt(typeFilter);
    return matchesSearch && matchesStatus && matchesType;
  });

  const searchActive =
    searchQuery || statusFilter !== "all" || typeFilter !== "all";
  
  useEffect(() => {
    const getVehicles = async () => {
      try {
        const response = await getRequest("/vehicle/");

        if (response.code === 200) {
          setVehicles(response.info);
        } else {
          toast.error(response.message);
          console.error(response.message);
        }
      } catch (err) {
        toast.error(err);
        console.error(err);
      }
    };
    getVehicles();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleItem
              key={vehicle.vehicle_id}
              vehicle={vehicle}
              onDeleteSucess={() => setVehicles(vehicles.filter((v) => v.vehicle_id !== vehicle.vehicle_id))}
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
