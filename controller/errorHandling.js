const AppError = require("../utils/appError");
require("dotenv").config();

const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        // Send operational error details to the client
        res.status(err.statusCode || 500).json({
            status: err.status || 'error',
            message: err.message,
        });
    } else {
        // Send generic message for unknown errors
        // use logger or winston
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
};

const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    if(err.name === 'SequelizeValidationError'){
        err = new AppError(err.errors[0].message,400)
    }

    if(err.name === 'SequelizeUniqueConstraintError'){
        err = new AppError(err.errors[0].message,400)
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Handle specific known errors
        if (err.code === 501) {
            error = new AppError('Not Implemented', 501);
        }

        sendErrorProd(error, res);
    }
};

module.exports = globalErrorHandler;
