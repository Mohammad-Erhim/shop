require('dotenv').config();

const Configurations = {
  [process.env.NODE_ENV]: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};

module.exports = Configurations;
