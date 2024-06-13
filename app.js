const express = require("express");
const authRouting = require("./route/authRouting");
const globalErrorHandler = require("./controller/errorHandling");
const AppError = require("./utils/appError");
const projectRouter = require( "./route/projectRoute" );
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRouting);
app.use("/api/project",projectRouter)

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server live at ${port}`);
});
