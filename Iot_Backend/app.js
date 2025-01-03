const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const trafficLogRoutes = require('./routes/trafficLogRoutes'); // Import the traffic log routes
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const homeRoutes = require('./routes/homeRoutes');



const connectMqtt = require('./services/mqttService');

// Import models
const User = require('./models/userModel');
const Device = require('./models/deviceModel');
const RfidCard = require('./models/rfidCardModel');
const TrafficLog = require('./models/trafficLogModel');

RfidCard.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(RfidCard, { foreignKey: 'user_id' });

RfidCard.hasMany(TrafficLog, { foreignKey: 'card_id' });
TrafficLog.belongsTo(RfidCard, { foreignKey: 'card_id' });
Device.hasMany(TrafficLog, { foreignKey: 'device_id' });
TrafficLog.belongsTo(Device, { foreignKey: 'device_id' });

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json()); // Allows the use of JSON in requests
app.use(cors()); // Allows cross-origin requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/logs', trafficLogRoutes); // Attach the traffic log routes
app.use('/api/user', userRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/device',deviceRoutes);
app.use('/api/home', homeRoutes)

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
