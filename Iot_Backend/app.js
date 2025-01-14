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
const http = require('http');


const {connectMqtt, mqttEventEmitter } = require('./services/mqttService');

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
const server = http.createServer(app);

// WebSocket for real-time monitoring
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust as per your frontend origin
  },
});

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

mqttEventEmitter.on('mqttMessage', (data) => {
  io.emit('mqttMessage', data);
  console.log('Received MQTT Event:', data);
});

mqttEventEmitter.on('deviceStatus', (data) => {
  io.emit('deviceStatus', data);
  console.log('Received MQTT Event:', data);
});

io.on('connection', (socket) => {
  console.log('Client connected to WebSocket');
  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket');
  });
});
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
