const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const trafficLogRoutes = require('./routes/trafficLogRoutes'); // Import the traffic log routes
const connectMqtt = require('./services/mqttService');

// Import models
const User = require('./models/userModel');
// const Vehicle = require('./models/vehicleModel');
const RfidCard = require('./models/rfidCardModel');
const TrafficLog = require('./models/trafficLogModel');

RfidCard.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(RfidCard, { foreignKey: 'user_id' });

RfidCard.hasMany(TrafficLog, { foreignKey: 'card_id' });
TrafficLog.belongsTo(RfidCard, { foreignKey: 'card_id' });
// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // Allows the use of JSON in requests
app.use(cors()); // Allows cross-origin requests

// Routes
app.use('/api/logs', trafficLogRoutes); // Attach the traffic log routes

// Initialize and sync the database
async function init() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync all models
    await sequelize.sync(); // This will create tables based on your model definitions
    console.log('All models were synchronized successfully.');

    connectMqtt(); // Start the MQTT service within the server
    
    console.log('Server is running with MQTT enabled');

    // Your server logic here
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

init();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
