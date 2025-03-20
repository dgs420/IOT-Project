// Sample parking lot data
export const parkingLots = [
    { id: 1, name: "Downtown Parking", totalSpots: 120, availableSpots: 45, location: "123 Main St" },
    { id: 2, name: "Central Plaza", totalSpots: 80, availableSpots: 12, location: "456 Park Ave" },
    { id: 3, name: "Riverside Garage", totalSpots: 200, availableSpots: 78, location: "789 River Rd" },
];

// Sample user cards data
export const userCards = [
    { id: "RFID-8742", type: "Standard", vehicle: "ABC-123", balance: 25.50, status: "active" },
    { id: "RFID-9651", type: "Premium", vehicle: "XYZ-789", balance: 10.25, status: "active" },
];

// Sample transaction data
export const recentTransactions = [
    { id: 1, date: "2023-06-15", time: "09:30 AM", type: "Parking Fee", amount: -5.00, location: "Downtown Parking" },
    { id: 2, date: "2023-06-14", time: "02:15 PM", type: "Top Up", amount: 20.00, location: "Online" },
];