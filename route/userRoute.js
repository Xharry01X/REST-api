const express = require("express");
const { authentication, restrictTo } = require("../controller/authController");
const { getAllUser } = require("../controller/userController");

const userRoute = express.Router();

userRoute.route("/").get(authentication, restrictTo('buyer'), getAllUser);

module.exports = userRoute;
