const { Sequelize } = require('sequelize');
require('dotenv').config(); // To use .env variables

// Create a Sequelize instance and connect to the MySQL database
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  
  host: process.env.DB_HOST,
  dialect: 'mysql',
  timezone: '+07:00',
  logging: false,
  dialectOptions:{
    // dateStrings: true, // This ensures dates are returned as strings
    // typeCast: function (field, next) { // Convert timestamps to Date objects
    //   if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
    //     return new Date(field.string() + 'Z'); // Convert to UTC and append 'Z' to indicate UTC time
    //   }
    //   return next();
    // }
  }
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected...'))
  .catch(err => console.error('Error connecting to MySQL:', err));
// sequelize.sync({ alter: true })
//     .then(() => console.log('MySQL synced...'))
//     .catch(err => console.error('Error syncing MySQL models:', err));
module.exports = sequelize;
