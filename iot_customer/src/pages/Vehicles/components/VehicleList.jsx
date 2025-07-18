import React from 'react';
import { VehicleItem } from './VehicleItem.jsx';
import { EmptyCardList } from './EmptyCardList';

export const VehicleList = ({
                              cards,
                              searchQuery,
                              statusFilter,
                              onAddNewCard
                          }) => {
    // Filter and search cards
    const filteredCards = cards.filter(card => {
        const matchesSearch =
            // card.card_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || card.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const searchActive = searchQuery || statusFilter !== 'all';

    return (
        <div className="p-6">
            {filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCards.map((card) => (
                        <VehicleItem
                            key={card.vehicle_id}
                            card={card}
                        />
                    ))}
                </div>
            ) : (
                <EmptyCardList
                    searchActive={searchActive}
                    onAddNewCard={onAddNewCard}
                />
            )}
        </div>
    );
};
