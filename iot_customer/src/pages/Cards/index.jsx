import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { getRequest } from "../../api/index.jsx";
import { CardListHeader } from './components/CardListHeader';
import { CardSearch } from './components/CardSearch';
import { CardsList } from './components/CardsList';
import NewCardDialog from "../Home/Components/Dialogs/NewCardDialog.jsx";

export const UserCards = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const getCards = async () => {
            try {
                const response = await getRequest("/card/your-cards");

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

    // Handle card actions
    const handleEditCard = (card) => {
        setSelectedCard(card);
        setShowAddCardModal(true);
    };

    const handleDeleteCard = (cardId) => {
        // Implement delete functionality
        console.log(`Delete card with ID: ${cardId}`);
        // In a real app, you would call an API to delete the card
        // and then update the state
    };

    const handleAddCard = () => {
        setSelectedCard(null);
        setShowAddCardModal(true);
    };

    const handleSaveCard = () => {
        // Implement save functionality
        console.log("Save card", selectedCard);
        // In a real app, you would call an API to save the card
        setShowAddCardModal(false);
    };

    return (
        <div className="mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow">
                <CardListHeader onRequestCard={handleAddCard} />

                <CardSearch
                    searchQuery={searchQuery}
                    onSearchChange={(e) => setSearchQuery(e.target.value)}
                    statusFilter={statusFilter}
                    onStatusFilterChange={(e) => setStatusFilter(e.target.value)}
                />

                <CardsList
                    cards={cards}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                    onAddNewCard={handleAddCard}
                />
            </div>

            <NewCardDialog
                open={showAddCardModal}
                onClose={() => setShowAddCardModal(false)}
            />

        </div>
    );
};