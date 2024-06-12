const express = require("express");
const authRouting = require("./route/authRouting");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require( "./controller/errorHandling" );
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRouting);

// Handle undefined routes
app.use("*",catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);

}))
// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server live at ${port}`);
});
