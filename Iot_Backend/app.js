const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/database');
// const lockRoutes = require('./routes/lockRoutes');

// Import models
const User = require('./models/userModel');
const Vehicle = require('./models/vehicleModel');
const RfidCard = require('./models/rfidCardModel');
const TrafficLog = require('./models/trafficLogModel');

const app = express();
app.use(express.json());

async function init() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync all models
    await sequelize.sync(); // This will create tables based on your model definitions
    console.log('All models were synchronized successfully.');

    // Your server logic here
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

init();


// Routes
// app.use('/api/lock', lockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
