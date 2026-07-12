// backend/src/config/database.js
//
// Creates and exports the single Sequelize instance used across the whole
// backend. Every model file (src/models/*.js) imports this same instance,
// so there is only ever one connection pool to MySQL.

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      // Use snake_case column names in MySQL (e.g. license_expiry_date)
      // while keeping camelCase in JS model attributes (licenseExpiryDate).
      underscored: true,
      // Adds createdAt / updatedAt columns automatically to every table.
      timestamps: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Quick connectivity check, called once from server.js on boot so a bad
// DB_PASSWORD or unreachable host fails loudly and immediately instead of
// surfacing as a confusing error on the first API request.
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
}

module.exports = { sequelize, testConnection };
