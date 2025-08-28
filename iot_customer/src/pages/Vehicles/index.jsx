import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getRequest } from "../../api/index.js";
import { CardListHeader } from "./components/CardListHeader";
import { VehicleSearch } from "./components/VehicleSearch.jsx";
import { VehicleList } from "./components/VehicleList.jsx";
import NewVehicleDialog from "../../Common/Components/Dialogs/NewVehicleDialog.jsx";
import { fetchData } from "../../api/fetchData.js";
import PageContentHeader from "../../Common/Components/PageContentHeader.jsx";

export const UserVehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    void fetchData("/vehicle/your-vehicles", setVehicles, null, null);
  }, []);

  const handleAddVehicle = () => {
    setSelectedCard(null);
    setShowAddCardModal(true);
  };

  return (
    <div>
      {/* <CardListHeader onRequestCard={handleAddCard} /> */}
      <PageContentHeader
        label="Registered Vehicles"
        description="View your registered vehicles"
        className="mb-4"
        buttonLabel="Request New Vehicle"
        onClick={handleAddVehicle}
      />
      <VehicleSearch
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        statusFilter={statusFilter}
        onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
      />

      <VehicleList
        cards={vehicles}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
      />

      <NewVehicleDialog
        open={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
      />
    </div>
  );
};
