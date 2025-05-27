const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const trafficLogRoutes = require('./routes/trafficLogRoutes');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const homeRoutes = require('./routes/homeRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const vehicleTypeRoutes = require('./routes/vehicleTypeRoutes');
const spaceRoutes = require('./routes/spaceRoutes');

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
const Notification = require('./models/notificationModel');
const Transaction = require('./models/transactionModel');
const ParkingSpace = require('./models/parkingSpaceModel');
const Vehicle = require('./models/vehicleModel');
const VehicleType = require('./models/vehicleTypeModel');
require('./models/modelHooks');

RfidCard.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(RfidCard, { foreignKey: 'user_id' });

// One RFID Card corresponds to one Vehicle
RfidCard.hasOne(Vehicle, { foreignKey: 'card_id' });
Vehicle.belongsTo(RfidCard, { foreignKey: 'card_id' });

Vehicle.belongsTo(VehicleType, { foreignKey: "vehicle_type_id"});
VehicleType.hasMany(Vehicle, { foreignKey: "vehicle_type_id" });

ParkingSpace.belongsTo(VehicleType, { foreignKey: 'vehicle_type_id' });

ParkingSession.belongsTo(Vehicle, {foreignKey: "vehicle_id"});
Vehicle.hasMany(ParkingSession, { foreignKey: "vehicle_id"});

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
    origin: '*',
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
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/vehicle-type', vehicleTypeRoutes);
app.use('/api/parking-spaces',spaceRoutes)

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


mqttEventEmitter.on('notification', (data) => {
  io.to(`user_${data.user_id}`).emit('notification', data);
  console.log(data);
});


io.on('connection', (socket) => {
  console.log('Client connected to WebSocket');
  socket.on("join_gate", (gate_id) => {
    socket.join(gate_id);
    console.log(`Kiosk joined gate: ${gate_id}`);
  });
  socket.on("join_notifications", (user_id) => {
    socket.join(`user_${user_id}`);
    console.log(`User ${user_id} joined notifications room`);
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
