const expressAsyncHandler = require("express-async-handler");
const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signUp = expressAsyncHandler(async (req, res) => {
  const body = req.body;

  if (['1', '2'].includes(body.userType)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid user type",
    });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await user.findOne({ where: { email: body.email } });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists",
      });
    }

    const newUser = await user.create({
      userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });

    //delete password from result and adding token
    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
      id: result.id,
    });

    if (!result) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to create User",
      });
    }

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    // Log the error message to the console
    console.error("Error creating user:", error.message);

    // Return an error response
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
});

module.exports = { signUp };
