const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  retry: {
    max: 10,
    match: [
      Sequelize.ConnectionError,
      Sequelize.ConnectionRefusedError,
      Sequelize.TimeoutError,
    ],
  },
});

module.exports = sequelize;