'use strict';
const {
  Model,
  Sequelize,
  DataTypes
} = require('sequelize');
const bcrypt=require("bcryptjs")
const sequelize = require("../../database/database");

//by defaut it make user to plural
const user=sequelize.define('user',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('seller', 'buyer'),
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  // Sequelize provide getter and setter method
  confirmPassword:{
  type:DataTypes.VIRTUAL,
  set(value){
    if(value === this.password){
      const hashPassword=bcrypt.hashSync(value,10);
      this.setDataValue('password',hashPassword);
    }else{
      throw new Error(
        'Password and confirm password should be same'
      )
    }
  }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt:{
    
     type:DataTypes.DATE,
  },
},{
  paranoid:true, //actual data is not deleted but maked as it is deleted, add deleted At
  freezeTableName:true,
  modelName:"user",
})

module.exports=user