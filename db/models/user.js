'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');
const sequelize = require("../../database/database");

//by defaut it make user to plural
const user=sequelize.define('user',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userType: {
    type: Sequelize.ENUM('seller', 'buyer'),
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  deletedAt:{
    
     type:Sequelize.DATE,
  },
},{
  paranoid:true, //actual data is not deleted but maked as it is deleted, add deleted At
  freezeTableName:true,
  modelName:"user",
})

module.exports=user