
import React from 'react';

const TransactionPagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const showingFrom = ((currentPage - 1) * itemsPerPage) + 1;
    const showingTo = Math.min(currentPage * itemsPerPage, totalItems);

    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const handlePrevious = () => {
        if (!isFirstPage) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (!isLastPage) onPageChange(currentPage + 1);
    };
    return (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{showingFrom}</span> to <span className="font-medium">{showingTo}</span> of <span className="font-medium">{totalItems}</span> transactions
            </div>

            <div className="flex items-center space-x-2">
                <button
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isFirstPage}
                    onClick={handlePrevious}
                >
                    Previous
                </button>
                <button
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLastPage}
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TransactionPagination;