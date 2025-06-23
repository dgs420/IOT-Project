// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { deleteRequest, postRequest } from "../../../../api/index.js";
import { toast } from "react-toastify";
import { fetchData } from "../../../../api/fetchData.js";
import { ConfirmModal } from "../../../../common/components/ConfirmModal.jsx";
import { VehicleItem } from "../../../RegisteredVehicles/components/VehicleItem.jsx";
import AddCardModal from "./AddCardModal.jsx";
import { useSerialRFID } from "@/hooks/useSerialRFID.js";

const UserVehiclesList = ({ userId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    card_number: "",
    user_id: userId,
    vehicle_number: "",
    vehicle_type_id: 1,
  });

  useEffect(() => {
    void fetchData(`/vehicle/user-vehicles/${userId}`, setVehicles, null, null);
  }, [userId]);

  const { readCard } = useSerialRFID();
  const handleReadCard = () => {
  readCard((cardId) => {
    setNewVehicle((prev) => ({
      ...prev,
      card_number: cardId,
    }));
  });
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({ ...newVehicle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postRequest("/vehicle/create", newVehicle);
      if (response.code === 200) {
        await fetchData(
          `/vehicle/user-vehicles/${userId}`,
          setVehicles,
          null,
          null
        );
        setOpenModal(false);
        toast.success("New card added successfully.");
        // Reset form
        setNewVehicle({
          card_number: "",
          user_id: userId,
          vehicle_number: "",
          vehicle_type_id: 1,
        });
      } else {
        toast.error(response.message);
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Error adding RFID card:", error);
      toast.error("Failed to add new card");
    }
  };

  const onDeleteSucess = (vehicleId) => {
    const newVehicle = vehicles.filter(
      (vehicle) => vehicle.vehicle_id !== vehicleId
    );
    setVehicles(newVehicle);
  };

  return (
    <div className="px-4 py-4">
      <button
        onClick={() => {
          setOpenModal(true);
        }}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Vehicle
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <VehicleItem
              key={vehicle.vehicle_id}
              vehicle={vehicle}
              onDeleteSucess={() =>
                setVehicles(
                  vehicles.filter((v) => v.vehicle_id !== vehicle.vehicle_id)
                )
              }
            />
          ))
        ) : (
          <p>No RFID cards found for this user.</p>
        )}
      </div>

      <AddCardModal
        open={openModal}
        onReadCard={handleReadCard}
        onClose={() => setOpenModal(false)}
        newCard={newVehicle}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default UserVehiclesList;
