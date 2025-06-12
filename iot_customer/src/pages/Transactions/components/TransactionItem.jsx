import React from 'react';
import {Calendar} from 'lucide-react';
import {formatCurrency, formatDate} from '../../../utils/formatters';
import {
    getPaymentMethodIcon,
    getStatusBadge,
    getTransactionIcon,
    getTransactionTypeLabel
} from '../../../utils/transactionHelpers';
import {Link} from "react-router-dom";

const TransactionItem = ({transaction}) => {
    return (
        <div className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getTransactionIcon(transaction.transaction_type, transaction.status)}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900 mr-2">
                                {getTransactionTypeLabel(transaction.transaction_type)}
                            </h3>
                            {getStatusBadge(transaction.status)}
                        </div>

                        <div className="mt-1 flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1"/>
                            {formatDate(transaction.createdAt)}
                        </div>

                        <div className="mt-1 flex items-center text-xs text-gray-500">
                            <div className="mr-1">
                                {getPaymentMethodIcon(transaction.payment_method)}
                            </div>
                            {transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1)}
                            <span className="mx-1">•</span>
                            <span className="font-mono">
                                {transaction.payment_id ? `${transaction.payment_id.substring(0, 8)}...` : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-3 sm:mt-0 flex flex-col items-end">
                    <div className={`text-lg font-semibold ${
                        transaction.transaction_type === 'top-up' || transaction.transaction_type === 'refund'
                            ? 'text-green-600'
                            : 'text-blue-600'
                    }`}>
                        {transaction.transaction_type === 'top-up' || transaction.transaction_type === 'refund'
                            ? '+'
                            : '-'
                        }
                        {formatCurrency(transaction.amount)}
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                        Balance: {formatCurrency(transaction.balance)}
                    </div>
                </div>
            </div>
            {
                (transaction.session_id) && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                            Parkinkg Session ID: <span className="font-mono">{transaction.session_id}</span>
                        </div>
                        <Link to={'/activity'}>
                            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                View Details
                            </button>
                        </Link>
                    </div>
                )
            }

        </div>
    );
};

export default TransactionItem;