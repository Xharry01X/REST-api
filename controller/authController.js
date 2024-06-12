const expressAsyncHandler = require("express-async-handler");
const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const catchAsync = require( "../utils/catchAsync" );
const AppError = require( "../utils/appError" );
require("dotenv").config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signUp = catchAsync(expressAsyncHandler(async (req, res,next) => {
  const body = req.body;

  if (['1', '2'].includes(body.userType)) {
    throw new AppError("Inavid Usertype",400)
   
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await user.findOne({ where: { email: body.email } });

    if (existingUser) {
      return next(new AppError("User already exist"))
     
    }

    const newUser = await user.create({
      userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });
    if (!newUser) {
      return next (new AppError("Failed to create User",400))
     
    }

    //delete password from result and adding token
    const result = newUser.toJSON();
    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
      id: result.id,
    });



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
}));

//login controller
const login = expressAsyncHandler(async (req, res,next) => {
  const { email, password } = req.body;
  
  try {
    if (!email || !password) {
     return next(new AppError("Please enter valid email or password"))
    }

    const result = await user.findOne({ where: { email } });

    if (!result || !(await bcrypt.compare(password, result.password))) {
      return next(new AppError("Check email or password",400))
    }

    const token = generateToken({
      id: result.id,
    });

    return res.json({
      status: "success",
      token,
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
});

module.exports = { signUp , login};
