import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, Avatar, Badge,
    Container, Paper, Box, Button, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, Tab, Tabs,
    Card, CardContent, CardHeader, CardActions, List,
    ListItem, ListItemAvatar, ListItemText,
    MenuItem, Select, FormControl, InputLabel, Chip, CircularProgress
} from '@mui/material';
import {
    Notifications, CreditCard, Add, AccessTime, CalendarToday,
    ChevronRight, AccountBalanceWallet
} from '@mui/icons-material';

const parkingLots = [
    { id: 1, name: "Downtown Parking", totalSpots: 120, availableSpots: 45, location: "123 Main St" },
    { id: 2, name: "Central Plaza", totalSpots: 80, availableSpots: 12, location: "456 Park Ave" },
    { id: 3, name: "Riverside Garage", totalSpots: 200, availableSpots: 78, location: "789 River Rd" },
];

const userCards = [
    { id: "RFID-8742", type: "Standard", vehicle: "ABC-123", balance: 25.50, status: "active" },
    { id: "RFID-9651", type: "Premium", vehicle: "XYZ-789", balance: 10.25, status: "active" },
];

const recentTransactions = [
    { id: 1, date: "2023-06-15", time: "09:30 AM", type: "Parking Fee", amount: -5.00, location: "Downtown Parking" },
    { id: 2, date: "2023-06-14", time: "02:15 PM", type: "Top Up", amount: 20.00, location: "Online" },
];

export default function CustomerDashboard() {
    const [topUpAmount, setTopUpAmount] = useState("20");
    const [tabValue, setTabValue] = useState(0);
    const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
    const [newCardDialogOpen, setNewCardDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleTopUp = () => {
        setLoading(true);
        // Simulate async operation
        setTimeout(() => {
            setLoading(false);
            setTopUpDialogOpen(false);
        }, 2000);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Container sx={{ py: 4 }}>
                {/* Balance and Cards Section */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
                    <Paper sx={{ p: 3, background: 'linear-gradient(to right, #1976d2, #42a5f5)', color: 'white', flex: 1, boxShadow: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6">Current Balance</Typography>
                            <CreditCard />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                            Your available parking credit
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 3 }}>$35.75</Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Add />}
                                onClick={() => setTopUpDialogOpen(true)}
                            >
                                Top Up Balance
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<CreditCard />}
                                onClick={() => setNewCardDialogOpen(true)}
                            >
                                Request New Card
                            </Button>
                        </Box>
                    </Paper>
                    <Paper sx={{ p: 3, flex: 1, boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Your Cards</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Manage your parking cards
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {userCards.map((card) => (
                                <Box
                                    key={card.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 1.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                        '&:hover': { boxShadow: 2 },
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body1" fontWeight="medium">{card.id}</Typography>
                                        <Typography variant="body2" color="text.secondary">{card.vehicle}</Typography>
                                    </Box>
                                    <Chip
                                        label={card.type}
                                        variant="outlined"
                                        size="small"
                                        sx={{ textTransform: 'capitalize' }}
                                    />
                                </Box>
                            ))}
                        </Box>
                        <Button
                            fullWidth
                            variant="text"
                            endIcon={<ChevronRight />}
                            sx={{ mt: 2 }}
                        >
                            View All Cards
                        </Button>
                    </Paper>
                </Box>

                {/* Tabs Section */}
                <Paper sx={{ mb: 4, boxShadow: 3 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Parking Map" />
                        <Tab label="Recent Transactions" />
                    </Tabs>

                    {/* Transactions Tab */}
                    {tabValue === 1 && (
                        <Box sx={{ p: 3 }}>
                            <Card>
                                <CardHeader
                                    title="Recent Transactions"
                                    subheader="Your parking and payment history"
                                />
                                <CardContent>
                                    <List sx={{ p: 0 }}>
                                        {recentTransactions.map((transaction) => (
                                            <ListItem
                                                key={transaction.id}
                                                sx={{
                                                    p: 2,
                                                    mb: 2,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 1,
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: transaction.amount > 0 ? 'success.light' : 'primary.light',
                                                            color: transaction.amount > 0 ? 'success.dark' : 'primary.dark',
                                                        }}
                                                    >
                                                        {transaction.amount > 0 ? <AccountBalanceWallet /> : <AccessTime />}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={transaction.type}
                                                    secondary={
                                                        <>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <CalendarToday sx={{ fontSize: 12, mr: 0.5 }} />
                                                                {transaction.date} • {transaction.time}
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {transaction.location}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="medium"
                                                    color={transaction.amount > 0 ? 'success.main' : 'primary.main'}
                                                >
                                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                                <CardActions>
                                    <Button fullWidth variant="outlined">View All Transactions</Button>
                                </CardActions>
                            </Card>
                        </Box>
                    )}
                </Paper>
            </Container>

            {/* Top Up Dialog */}
            <Dialog open={topUpDialogOpen} onClose={() => setTopUpDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Top Up Your Balance</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Add funds to your parking account. The amount will be immediately available.
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                        {["10", "20", "50", "100"].map((amount) => (
                            <Button
                                key={amount}
                                variant={topUpAmount === amount ? "contained" : "outlined"}
                                onClick={() => setTopUpAmount(amount)}
                            >
                                ${amount}
                            </Button>
                        ))}
                    </Box>

                    <TextField
                        label="Custom Amount"
                        fullWidth
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <FormControl fullWidth>
                        <InputLabel>Payment Method</InputLabel>
                        <Select
                            label="Payment Method"
                            defaultValue="card"
                            variant="outlined"
                        >
                            <MenuItem value="card">Credit/Debit Card</MenuItem>
                            <MenuItem value="paypal">PayPal</MenuItem>
                            <MenuItem value="apple">Apple Pay</MenuItem>
                            <MenuItem value="google">Google Pay</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setTopUpDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleTopUp} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : "Proceed to Payment"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* New Card Dialog */}
            <Dialog open={newCardDialogOpen} onClose={() => setNewCardDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Request a New Parking Card</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Fill in the details to request a new parking card. Processing may take 1-2 business days.
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Card Type</InputLabel>
                        <Select
                            label="Card Type"
                            defaultValue="standard"
                            variant="outlined"
                        >
                            <MenuItem value="standard">Standard</MenuItem>
                            <MenuItem value="premium">Premium</MenuItem>
                            <MenuItem value="business">Business</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Vehicle Number"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Vehicle Type</InputLabel>
                        <Select
                            label="Vehicle Type"
                            defaultValue="car"
                            variant="outlined"
                        >
                            <MenuItem value="car">Car</MenuItem>
                            <MenuItem value="motorcycle">Motorcycle</MenuItem>
                            <MenuItem value="truck">Truck</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Delivery Address"
                        fullWidth
                        multiline
                        rows={2}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewCardDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained">Submit Request</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}