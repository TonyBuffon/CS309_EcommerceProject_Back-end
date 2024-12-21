// Handler made by *https://www.github.com/TonyBuffon* and enhanced to manage sequelize db Error :)
//  IMPORT AppError to handle errors in different way
const AppError = require("./AppError");

// Handling DB ERROR HANDLERS
// ! Mongoose Errors
// Casting errors for wrong type of data in mongoose
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Handle mongoose duplicate errors for unique fields
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

// handle custom validation errors through mongoose schema
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// ! Sequelize Errors
// handle Sequelize Validation Errors
const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map((err) => {
    console.log(err);
    return err.message;
  });
  console.log(err.errors[0].value);
  console.log(err.errors[0].validatorArgs);

  return new AppError(errors.join(" \n "), 400);
};
// Handle errors for wrong inputs
const handleSequelizeDatabaseError = (err) => {
  const type = err.message.split("type ")[1];
  const errMsg = `Invalid input data for ${type}`;
  return new AppError(errMsg, 500);
};

// Handling JWT ERRORS
const handleJWTError = (err) =>
  new AppError("Invalid token. Please log in again", 401);
const handleJWTExpiredError = (err) =>
  new AppError("Your token has expired! Please log in again.", 401);

// CREATING ERROR RES
const sendErrorProd = (err, req, res, next) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status || "failed",
        msg: err.message,
      });

      // Programming or other unknown error: don't leak error details
    }
    // 1) Log error
    console.error("ERROR 💥", err);

    // 2) Send generic message
    return res.status(500).json({
      status: "failed",
      msg: "Something went wrong",
    });
  }
  // B) Rendered Website
  if (err.isOperational) {
    return res.status(err.statusCode).send({
      title: "Something went wrong!",
      msg: err.message,
    });

    // Programming or other unknown error: don't leak error details
  }
  // 1) Log error
  console.error("ERROR 💥", err);

  // 2) Send generic message
  return res.status(err.statusCode).send({
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

// EXPORTS THE ERROR HANDLED MESSAGES
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = "failed";

  // if (process.env.NODE_ENV === 'development') {
  //     sendErrorDev(err, req, res, next);
  // } else if (process.env.NODE_ENV === 'production') {
  let error = { ...err };

  error.message = err.message;
  switch (err.name) {
    case "CastError":
      error = handleCastErrorDB(error);
      break;
    case "ValidationError":
      error = handleValidationErrorDB(error);
      break;
    case "JsonWebTokenError":
      error = handleJWTError(error);
      break;
    case "TokenExpiredError":
      error = handleJWTExpiredError(error);
      break;
    case "SequelizeValidationError":
      error = handleSequelizeValidationError(error);
      break;
    case "SequelizeUniqueConstraintError":
      error = handleSequelizeValidationError(error);
      break;
    case "SequelizeDatabaseError":
      error = handleSequelizeDatabaseError(error);
      break;
    default:
      break;
  }

  if (err.code === 11000) {
    error = handleDuplicateFieldsDB(err);
  }

  sendErrorProd(error, req, res, next);
  // }
};
