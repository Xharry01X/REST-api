require('dotenv').config();

console.log(
  "DB_USERNAME:", process.env.DB_USERNAME,
  "DB_PASSWORD:", process.env.DB_PASSWORD,
  "DB_NAME:", process.env.DB_NAME,
  "DB_HOST:", process.env.DB_HOST,
  "DB_PORT:", process.env.DB_PORT
);

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
