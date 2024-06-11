const expressAsyncHandler = require("express-async-handler");
const user=require("../db/models/user")

const signUp = expressAsyncHandler(async (req, res) => {
  const body = req.body;

  if (['1', '2'].includes(body.userType)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid user type"
    });
  }

  try {
    const newUser = await user.create({
      userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });

    if (!newUser) {
      return res.status(400).json({
        status: "fail",
        message: "Failed to create User",
      });
    }

    return res.status(201).json({
      status: "success",
      data: newUser,
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
