'use strict';
const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require("bcryptjs");
const sequelize = require("../../database/database");
const AppError = require('../../utils/appError');
const Project=require("./project")


const user = sequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userType: {
    type: DataTypes.ENUM('seller', 'buyer'),
    allowNull: false, // Validation and constraint
    validate: {
      notNull: {
        msg: "UserType cannot be null",
      },
      notEmpty: {
        msg: "UserType cannot be empty",
      }
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false, // Validation and constraint
    validate: {
      notNull: {
        msg: "FirstName cannot be null",
      },
      notEmpty: {
        msg: "FirstName cannot be empty",
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false, // Validation and constraint
    validate: {
      notNull: {
        msg: "LastName cannot be null",
      },
      notEmpty: {
        msg: "LastName cannot be empty",
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Validation and constraint
    unique: true,
    validate: {
      notNull: {
        msg: "Email cannot be null",
      },
      notEmpty: {
        msg: "Email cannot be empty",
      },
      isEmail: {
        msg: "Invalid email address",
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Validation and constraint
    validate: {
      notNull: {
        msg: "Password cannot be null",
      },
      notEmpty: {
        msg: "Password cannot be empty",
      },
      len: {
        args: [8, 100],
        msg: "Password must be at least 8 characters long",
      }
    }
  },
  confirmPassword: {
    type: DataTypes.VIRTUAL,
    set(value) {
      if (this.password.length < 8) {
        throw new AppError("Password length must be greater than 7", 400);
      }

      if (value !== this.password) {
        throw new AppError('Password and confirm password should be same', 400);
      }

      const hashPassword = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hashPassword);
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
  deletedAt: {
    type: DataTypes.DATE,
  },
}, {
  paranoid: true, // Soft delete
  freezeTableName: true,
  modelName: "user",
});


user.hasMany(Project,{
  foreignKey: 'createdBy'
})

Project.belongsTo(user,{
  foreignKey: 'createdBy',
})

module.exports = user;
