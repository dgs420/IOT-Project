import React from 'react';
import { CreditCard } from 'lucide-react';

export const CardFormModal = ({
  isOpen,
  onClose,
  selectedCard,
  onSave
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {selectedCard ? 'Edit RFID Card' : 'Add New RFID Card'}
                </h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="card_number" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="card_number"
                      id="card_number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="RFID0001"
                      defaultValue={selectedCard?.card_number || ''}
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicle_number" className="block text-sm font-medium text-gray-700">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      name="vehicle_number"
                      id="vehicle_number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="ABC123"
                      defaultValue={selectedCard?.vehicle_number || ''}
                    />
                  </div>

                  <div>
                    <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-700">
                      Vehicle Type
                    </label>
                    <select
                      id="vehicle_type"
                      name="vehicle_type"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue={selectedCard?.vehicle_type || 'car'}
                    >
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      defaultValue={selectedCard?.status || 'active'}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="entered">Entered</option>
                      <option value="exited">Exited</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onSave}
            >
              {selectedCard ? 'Save Changes' : 'Add Card'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};