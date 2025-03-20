// File: src/components/CustomerDashboard/dialogs/TopUpDialog.jsx
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from "@mui/material";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function TopUpDialog({ open, onClose, amount }) {
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleConfirmPayment = async () => {
        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success?amount=${amount}`
            }
        });

        if (error) {
            console.log("Payment failed:", error.message);
            setLoading(false);
        }
        // The redirect will happen automatically on success
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Complete Your Payment</DialogTitle>
            <DialogContent>
                <PaymentElement />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleConfirmPayment}
                    disabled={loading || !stripe}
                >
                    {loading ? <CircularProgress size={24} /> : "Confirm Payment"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}