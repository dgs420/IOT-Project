import React, {useState} from "react";
// import NewCardDialog from "../../Common/Components/Dialogs/NewCardDialog.jsx";
import {Box} from "@mui/material"
import {VehicleSearch} from "./components/VehicleSearch.jsx";
import {VehicleList} from "./components/VehicleList.jsx";
import {VehicleFormModal} from "./components/VehicleFormModal.jsx";
import PageContentHeader from "../../common/components/PageContentHeader.jsx";

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
        <Box>
            <PageContentHeader
                label="Registered Vehicles"
                description="List of all registered vehicles"
                className="mb-4"
            />

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
        </Box>
    );
};
