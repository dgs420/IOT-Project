import React from 'react';
import { CreditCard, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { StatusBadge } from '../utils/StatusBadge';
import {VehicleIcon} from '../../../utils/VehicleIcon.jsx';
import {useVehicleTypeStore} from "../../../store/useVehicleTypeStore.js";

export const VehicleItem = ({ card }) => {
    const getTypeNameById = useVehicleTypeStore(state => state.getTypeNameById);
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                        <div
                            className={`p-2 rounded-full ${
                                card.status.toLowerCase() === 'active' ? 'bg-green-100' :
                                    card.status.toLowerCase() === 'parking' ? 'bg-blue-100' :
                                        'bg-gray-100'
                            }`}
                        >
                            <CreditCard
                                className={`h-6 w-6 ${
                                    card.status.toLowerCase() === 'active' ? 'text-green-600' :
                                        card.status.toLowerCase() === 'parking' ? 'text-blue-600' :
                                            'text-gray-600'
                                }`}
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{card.card_number}</h3>
                            <StatusBadge status={card.status} />
                        </div>
                    </div>

                    <div className="relative">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                            <MoreHorizontal className="h-5 w-5 text-gray-500" />
                        </button>
                        {/* Dropdown menu would go here */}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm">
                        <div className="w-8">
                            {VehicleIcon(card.vehicle_type_id)}
                        </div>
                        <div>
                            <span className="text-gray-500">Lisence Plate:</span>{' '}
                            <span className="font-medium">{card.vehicle_plate}</span>
                            <span className="ml-1 text-xs text-gray-500 capitalize">({getTypeNameById(card.vehicle_type_id)})</span>
                        </div>
                    </div>

                    <div className="flex items-center text-sm">
                        <div className="w-8">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                ID
              </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Card ID:</span>{' '}
                            <span className="font-mono font-medium">{card.card_id}</span>
                        </div>
                    </div>
                </div>

                {/*<div className="mt-5 flex justify-end space-x-2">*/}
                {/*    <button*/}
                {/*        onClick={() => onEdit(card)}*/}
                {/*        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"*/}
                {/*    >*/}
                {/*        <Edit className="h-3.5 w-3.5 mr-1" />*/}
                {/*        Edit*/}
                {/*    </button>*/}

                {/*    <button*/}
                {/*        onClick={() => onDelete(card.card_id)}*/}
                {/*        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"*/}
                {/*    >*/}
                {/*        <Trash2 className="h-3.5 w-3.5 mr-1" />*/}
                {/*        Delete*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};