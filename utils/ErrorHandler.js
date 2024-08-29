// Description: Custom error handler class.
// This class will be used to handle errors in the application.
class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    // 400s -> fail, 500 -> server related error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = ErrorHandler;
