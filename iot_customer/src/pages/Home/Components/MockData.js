// Sample parking lot data
export const parkingLots = [
    {
        space_id: 1,
        vehicle_type_id: 1,
        total_spaces: 2,
        occupied_spaces: 0,
        available_spaces: 2
    },
    {
        space_id: 2,
        vehicle_type_id: 2,
        total_spaces: 5,
        occupied_spaces: 0,
        available_spaces: 5
    },
    {
        space_id: 3,
        vehicle_type_id: 3,
        total_spaces: 5,
        occupied_spaces: 0,
        available_spaces: 5
    },
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