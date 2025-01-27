class CustomError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    details: [],
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  };

  if (err.errors && Array.isArray(err.errors)) {
    response.message = "Validation failed";
    response.details = err.errors.map((error) => ({
      message: error.msg,
    }));
  }

  res.status(statusCode).json(response);
};

module.exports = { CustomError, errorHandler };
