const { Sequelize } = require('sequelize');
require('dotenv').config(); // To use .env variables

// Create a Sequelize instance and connect to the MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  timezone: '+07:00'
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected...'))
  .catch(err => console.error('Error connecting to MySQL:', err));

module.exports = sequelize;
