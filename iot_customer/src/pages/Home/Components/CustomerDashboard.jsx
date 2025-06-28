import React, { useEffect, useState } from "react";
import { Box, Container, Paper, Tab, Tabs } from "@mui/material";
import BalanceCard from "./BalanceCard";
import HomeVehiclesPanel from "./HomeVehiclesPanel.jsx";
import ParkingMap from "./ParkingMap";
import HomeTransactionPanel from "./HomeTransactionPanel";
import TopUpDialogWrapper from "../../../Common/Components/Dialogs/TopUpDialogWrapper";
import NewVehicleDialog from "../../../Common/Components/Dialogs/NewVehicleDialog.jsx";
import { loadStripe } from "@stripe/stripe-js";
// import process from "process";

import { fetchData } from "../../../api/fetchData.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CustomerDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [newVehicleDialogOpen, setNewVehicleDialogOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [balance, setBalance] = useState(0);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseTopUpDialog = () => {
    setTopUpDialogOpen(false);
    setClientSecret("");
  };

  useEffect(() => {
    void fetchData("/parking-spaces", setParkingSpaces, null, null);
    void fetchData("/payment/recent-transactions", setTransactions, null, null);
    void fetchData("/user/balance", setBalance, null, null);
  }, []);
  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        <BalanceCard
          balance={balance}
          onTopUp={() => setTopUpDialogOpen(true)}
        />
        <HomeVehiclesPanel onRequestNewCard={() => setNewVehicleDialogOpen(true)} />
      </Box>

      <Paper sx={{ mb: 4, boxShadow: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Parking Occupancy" />
          <Tab label="Recent Transactions" />
        </Tabs>

        {tabValue === 0 && <ParkingMap parkingLots={parkingSpaces} />}
        {tabValue === 1 && <HomeTransactionPanel transactions={transactions} />}
      </Paper>

      <TopUpDialogWrapper
        open={topUpDialogOpen}
        onClose={handleCloseTopUpDialog}
        clientSecret={clientSecret}
        setClientSecret={setClientSecret}
        stripePromise={stripePromise}
        currentBalance={balance}
      />

      <NewVehicleDialog
        open={newVehicleDialogOpen}
        onClose={() => setNewVehicleDialogOpen(false)}
      />
    </Box>
  );
}
