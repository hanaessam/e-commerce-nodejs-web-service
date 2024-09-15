const APIError = require("../utils/APIError");

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJWTInvalidSignature = () => new APIError("Invalid token, Please login again", 401);
const handleJWTExpiredError = () => new APIError("Token expired", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      handleJWTInvalidSignature();
    }
    if (err.name === "TokenExpiredError") {
      handleJWTExpiredError();
    }
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
