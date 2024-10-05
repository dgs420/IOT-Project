const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db');
const lockRoutes = require('./routes/lockRoutes');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// MySQL Connection Sync
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

// Routes
app.use('/api/lock', lockRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
