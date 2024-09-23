const ApiErr = require("../utils/ApiErr");

// for dev mode
const sendError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// for production
const sendError_prod = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJwtInvalidToken = () =>
  new ApiErr(" Invalid token, please login again", 401);

const handleJwtExpired = () =>
  new ApiErr(" Expired token, please login again", 401);

const errorHandling = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendError(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidToken();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendError_prod(err, res);
  }
};

module.exports = errorHandling;
