// Error Middleware
const ApiError = require("../utils/ApiError");

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // Handle unexpected errors
  console.error("Unexpected error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorMiddleware;
