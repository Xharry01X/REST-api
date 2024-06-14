const expressAsyncHandler = require("express-async-handler");
const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
require("dotenv").config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const signUp = catchAsync(expressAsyncHandler(async (req, res, next) => {
  const body = req.body;

  if (!['seller', 'buyer'].includes(body.userType)) {
    return next(new AppError("Invalid user type", 400));
  }

  // Check if a user with the given email already exists
  const existingUser = await user.findOne({ where: { email: body.email } });

  if (existingUser) {
    return next(new AppError("User already exists", 400));
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
    return next(new AppError("Failed to create User", 400));
  }

  // Remove password from the response and add token
  const result = newUser.toJSON();
  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({ id: result.id });

  res.status(201).json({
    status: "success",
    data: result,
  });
}));

const login = catchAsync(expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please enter valid email and password", 400));
  }

  const result = await user.findOne({ where: { email } });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Check email and password", 400));
  }

  const token = generateToken({ id: result.id });

  res.json({
    status: "success",
    token,
  });
}));

const authentication = catchAsync(async (req, res, next) => {
  try {
    // Get token from header
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Please login to get access', 401));
    }

    // Token verification
    const tokenDetail = jwt.verify(token, process.env.SECRET_KEY);

    // Fetch the user by primary key
    const fetchUser = await user.findByPk(tokenDetail.id); // Assuming the tokenDetail contains the user ID

    if (!fetchUser) {
      return next(new AppError('User no longer exists', 400));
    }

    // Attach user to the request
    req.user = fetchUser;

    // Proceed to the next middleware
    return next();

  } catch (error) {
    return next(error);
  }
});

// Authorization middleware
const restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return next(new AppError("You don't have permission to perform this action", 403));
    }
    return next();
  };
};

module.exports = { signUp, login, authentication, restrictTo };
