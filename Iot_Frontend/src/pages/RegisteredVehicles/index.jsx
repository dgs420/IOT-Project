import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getRequest } from "../../api/index.js";
// import NewCardDialog from "../../Common/Components/Dialogs/NewCardDialog.jsx";
import { VehicleListHeader } from "./components/VehicleListHeader.jsx";
import { VehicleSearch } from "./components/VehicleSearch.jsx";
import { VehicleList } from "./components/VehicleList.jsx";
import { VehicleFormModal } from "./components/VehicleFormModal.jsx";

export const RegisteredVehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [vehicles, setVehicles] = useState([]);

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

  const handleAddCard = () => {
    setSelectedCard(null);
    setShowAddCardModal(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <VehicleListHeader onRequestCard={handleAddCard} />

      <VehicleSearch
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
      />

      <VehicleList
        vehicles={vehicles}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onAddNewCard={handleAddCard}
      />

      <VehicleFormModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
      />
    </div>
  );
};
