import React from 'react';
import { CreditCard, Plus } from 'lucide-react';

export const EmptyCardList = ({ searchActive, onAddNewCard }) => {
    return (
        <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cards found</h3>
            <p className="mt-1 text-sm text-gray-500">
                {searchActive
                    ? "Try changing your search or filter settings."
                    : "Get started by requesting a new RFID card."}
            </p>
            <div className="mt-6">
                <button
                    onClick={onAddNewCard}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Request New Card
                </button>
            </div>
        </div>
    );
};