import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Check, AlertCircle, Clock, CreditCard, Wallet } from 'lucide-react';

export const getTransactionIcon = (type, status) => {
    if (status !== 'completed') {
        return status === 'pending' ?
            <Clock className="h-5 w-5 text-amber-500" /> :
            <AlertCircle className="h-5 w-5 text-red-500" />;
    }

    switch (type) {
        case 'top-up':
            return <ArrowUpRight className="h-5 w-5 text-green-500" />;
        case 'payment':
            return <ArrowDownLeft className="h-5 w-5 text-blue-500" />;
        case 'refund':
            return <ArrowUpRight className="h-5 w-5 text-purple-500" />;
        default:
            return <Wallet className="h-5 w-5 text-gray-500" />;
    }
};

export const getPaymentMethodIcon = (method) => {
    switch (method) {
        case 'stripe':
            return <CreditCard className="h-4 w-4 text-gray-500" />;
        case 'paypal':
            return <img src="/paypal-icon.svg" alt="PayPal" className="h-4 w-4" />;
        default:
            return <Wallet className="h-4 w-4 text-gray-500" />;
    }
};

export const getStatusBadge = (status) => {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Completed
                </span>
            );
        case 'pending':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                </span>
            );
        case 'failed':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Failed
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {status}
                </span>
            );
    }
};

export const getTransactionTypeLabel = (type) => {
    switch (type) {
        case 'top-up':
            return 'Balance Top-up';
        case 'payment':
            return 'Parking Payment';
        case 'refund':
            return 'Refund';
        default:
            return type.charAt(0).toUpperCase() + type.slice(1);
    }
};