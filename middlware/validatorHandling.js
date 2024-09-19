const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
// @desc  To finds the validation errors
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  next();
};

module.exports = validate;