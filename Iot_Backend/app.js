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
const paymentRoutes = require('./routes/paymentRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const http = require('http');


const {startMqttService } = require('./services/mqttService');
const {mqttEventEmitter} = require('./services/eventEmitter');

// Import models
const User = require('./models/userModel');
const Device = require('./models/deviceModel');
const RfidCard = require('./models/rfidCardModel');
const TrafficLog = require('./models/trafficLogModel');
const ParkingSession = require('./models/parkingSessionModel');
const Request = require('./models/requestModel');
const notification = require('./models/notificationModel');


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

app.use("/api/payment/webhook", express.raw({ type: "application/json" }));
// Middleware
app.use(express.json()); // Allows the use of JSON in requests
app.use(cors()); // Allows cross-origin requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/logs', trafficLogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/device',deviceRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/payment',paymentRoutes);
app.use('/api/request',requestRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/notification', notificationRoutes);

mqttEventEmitter.on('mqttMessage', (data) => {
  io.emit('mqttMessage', data);
  console.log('Received MQTT Event:', data);
});

mqttEventEmitter.on('scan', (data) => {
  io.to(data.embed_id).emit('scan', data);
  console.log(data.embed_id);
  console.log('Scan result:', data);
});


mqttEventEmitter.on('deviceStatus', (data) => {
  io.emit('deviceStatus', data);
  console.log('Received MQTT Event:', data);
});

io.on('connection', (socket) => {
  console.log('Client connected to WebSocket');
  socket.on("join_gate", (gate_id) => {
    socket.join(gate_id);
    console.log(`Kiosk joined gate: ${gate_id}`);
  });
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
    await sequelize.sync(
        // { alter: true }
    );
    console.log('All models were synchronized successfully.');

    startMqttService(); // Start the MQTT service
    
    console.log('Server is running with MQTT enabled');


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
