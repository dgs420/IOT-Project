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
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  

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
        typeFilter={typeFilter}
        onTypeFilterChange={(e) => setTypeFilter(e.target.value)}
      />

      <VehicleList
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onAddNewCard={handleAddCard}
      />

      <VehicleFormModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
      />
    </div>
  );
};
