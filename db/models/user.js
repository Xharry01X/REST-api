'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require("../../database/database");

// Define the User model
const User = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('seller', 'buyer'), // Define ENUM values here
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE,
  }
}, {
  paranoid: true, // Enable soft deletes by using the deletedAt field
  freezeTableName: true, // Prevent Sequelize from pluralizing the table name
  modelName: 'user', // Define the model name
});

module.exports = User;
