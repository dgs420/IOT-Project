import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { getRequest } from "../../api/index.js";
import { CardListHeader } from './components/CardListHeader';
import { CardSearch } from './components/CardSearch';
import { VehicleList } from './components/VehicleList.jsx';
import NewCardDialog from "../../Common/Components/Dialogs/NewCardDialog.jsx";

export const UserCards = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const getCards = async () => {
            try {
                const response = await getRequest("/vehicle/your-vehicles");

                if (response.code === 200) {
                    setCards(response.info);
                } else {
                    toast.error(response.message);
                    console.error(response.message);
                }
            } catch (err) {
                toast.error(err);
                console.error(err);
            }
        }
        getCards();
    }, []);

    const handleAddCard = () => {
        setSelectedCard(null);
        setShowAddCardModal(true);
    };

    return (
            <div className="bg-white rounded-lg shadow">
                <CardListHeader onRequestCard={handleAddCard} />

                <CardSearch
                    searchQuery={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
                />

                <VehicleList
                    cards={cards}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onAddNewCard={handleAddCard}
                />

            <NewCardDialog
                open={showAddCardModal}
                onClose={() => setShowAddCardModal(false)}
            />

        </div>
    );
};