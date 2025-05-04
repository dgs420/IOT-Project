// File: src/components/CustomerDashboard/dialogs/TopUpDialogWrapper.jsx
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    TextField,
    Grid,
    Typography,
    Box,
    InputAdornment,
    Divider,
    Alert,
    Fade,
    Paper,
    Chip, IconButton, Grid2
} from "@mui/material";
import {
    AttachMoney,
    CreditCard,
    AccountBalance,
    Close,
    ArrowForward,
    CheckCircle
} from "@mui/icons-material";
import { Elements } from "@stripe/react-stripe-js";
import TopUpDialog from './TopUpDialog.jsx';
import { postRequest } from "../../../api/index.js";
import { toast } from "react-toastify";

export default function TopUpDialogWrapper({ open, onClose, clientSecret, setClientSecret, stripePromise, currentBalance }) {
    // Reset client secret when dialog is closed
    useEffect(() => {
        if (!open) {
            // Small delay to allow animations to complete
            const timer = setTimeout(() => {
                setClientSecret(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open, setClientSecret]);

    // If we don't have a clientSecret yet, show the initial dialog
    if (!clientSecret) {
        return <TopUpInitialDialog
            open={open}
            onClose={onClose}
            setClientSecret={setClientSecret}
            currentBalance={currentBalance}
        />;
    }

    // Once we have a clientSecret, show the payment dialog with Elements
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#1976d2',
                colorBackground: '#ffffff',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                fontFamily: 'Roboto, system-ui, sans-serif',
                borderRadius: '4px',
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <TopUpDialog open={open} onClose={onClose} />
        </Elements>
    );
}

// Initial dialog to collect amount and create PaymentIntent
function TopUpInitialDialog({ open, onClose, setClientSecret, currentBalance })  {
    const [topUpAmount, setTopUpAmount] = useState("20");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user_id = localStorage.getItem("uid");
    const [customAmount, setCustomAmount] = useState(false);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and decimal point
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setTopUpAmount(value);
        }
    };

    const handlePresetAmount = (amount) => {
        setTopUpAmount(amount);
        setCustomAmount(false);
    };

    const handleCustomAmountFocus = () => {
        setCustomAmount(true);
    };

    const createPaymentIntent = async () => {
        // Validate amount
        const amount = parseFloat(topUpAmount);
        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount greater than 0");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await postRequest("/payment/top-up", {
                amount: amount,
                currency: "usd",
                metadata: { user_id: user_id || "unknown" }
            });

            if (response && response.clientSecret) {
                setClientSecret(response.clientSecret);
                toast.info("Preparing payment form...");
            } else {
                setError("Unable to initialize payment. Please try again.");
                toast.error("Payment initialization failed");
            }
        } catch (error) {
            console.error("Error creating payment intent:", error);
            setError("An error occurred while processing your request. Please try again.");
            toast.error("Payment processing error");
        } finally {
            setLoading(false);
        }
    };

    const getNewBalance = () => {
        const amount = parseFloat(topUpAmount) || 0;
        const balance = parseFloat(currentBalance) || 0;
        return (balance + amount).toFixed(2);
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? null : onClose}
            maxWidth="sm"
            fullWidth

        >
            <DialogTitle sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box display="flex" alignItems="center">
                    <AttachMoney sx={{ mr: 1 }} />
                    <Typography variant="h6">Top Up Your Balance</Typography>
                </Box>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    disabled={loading}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                <Typography variant="subtitle1" gutterBottom>
                    Select an amount to add to your balance
                </Typography>

                <Grid2 container spacing={2} sx={{ mb: 3 }}>
                    {["10", "20", "50", "100"].map((amount) => (
                        <Grid2 item xs={3} key={amount}>
                            <Button
                                variant={topUpAmount === amount && !customAmount ? "contained" : "outlined"}
                                fullWidth
                                onClick={() => handlePresetAmount(amount)}
                                startIcon={<AttachMoney />}
                                sx={{ height: '100%' }}
                            >
                                {amount}
                            </Button>
                        </Grid2>
                    ))}
                </Grid2>

                <TextField
                    label="Custom Amount"
                    fullWidth
                    value={topUpAmount}
                    onChange={handleAmountChange}
                    onFocus={handleCustomAmountFocus}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AttachMoney />
                            </InputAdornment>
                        ),
                    }}
                    helperText="Enter the amount you want to add to your balance"
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Current Balance:</Typography>
                    <Typography variant="body1" fontWeight="medium">
                        ${parseFloat(currentBalance || 0).toFixed(2)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1">Amount to Add:</Typography>
                    <Typography variant="body1" fontWeight="medium" color="primary">
                        +${parseFloat(topUpAmount || 0).toFixed(2)}
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box display="flex" alignItems="center">
                        <CheckCircle sx={{ mr: 1 }} />
                        <Typography variant="body1">New Balance:</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                        ${getNewBalance()}
                    </Typography>
                </Paper>

                <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Payment Methods:
                    </Typography>
                    <Box display="flex" gap={1}>
                        <Chip icon={<CreditCard />} label="Credit Card" color="primary" variant="outlined" />
                        <Chip icon={<AccountBalance />} label="Bank Transfer" variant="outlined" />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, bgcolor: 'background.default' }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                    startIcon={<Close />}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={createPaymentIntent}
                    disabled={loading || !topUpAmount || parseFloat(topUpAmount) <= 0}
                    endIcon={loading ? <CircularProgress size={16} /> : <ArrowForward />}
                    sx={{ px: 3 }}
                >
                    {loading ? "Processing..." : "Proceed to Payment"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}