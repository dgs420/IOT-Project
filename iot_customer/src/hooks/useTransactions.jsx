// File: hooks/useTransactions.js
import { useState, useEffect } from 'react';
import {getRequest} from "../api/index.jsx";

// This is a mock implementation - in a real app, you'd fetch from an API
export const useTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate API call
        const getTransactions = async () => {
            try {
                setLoading(true);
                // const response = await api.getTransactions();
                const response = await getRequest("/payment/transactions");

                if (response.code === 200) {
                    setTransactions(response.info);
                } else
                    console.error(response.message);
                // setTransactions(mockData);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        getTransactions();
    }, []);

    return { transactions, loading, error };
};