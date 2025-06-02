import React, { useEffect, useState } from "react";
import { VehicleItem } from "./VehicleItem";
import { EmptyVehicleList } from "./EmptyVehicleList";
import { toast } from "react-toastify";
import { getRequest } from "../../../api";
import {fetchData} from "../../../api/fetchData.js";
import {TablePagination} from "@mui/material";

export const VehicleList = ({
  searchQuery,
  statusFilter,
  onAddNewCard,
  typeFilter,
}) => {
  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(6)


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
    void fetchData("/vehicle/", setVehicles);
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vehicle) => (
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
      <TablePagination
          component="div"
          count={filteredVehicles.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[6, 12, 24]}
      />
    </div>
  );
};
