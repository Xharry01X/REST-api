const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require( "../db/models/user" );

const signUp = expressAsyncHandler(async (req, res) => {
  const { userType, firstName, lastName, email, password } = req.body;

  try {
    // Check if the email is already taken
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already in use",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userType,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
    });
  }
});

module.exports = { signUp };
