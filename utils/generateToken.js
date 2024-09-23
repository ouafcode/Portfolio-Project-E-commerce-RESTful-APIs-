const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  // Generate token using jsonwebtoken
  jwt.sign({ userId: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

module.exports = generateToken;
