const express = require("express");

const router = express.Router();

const {
  signUp_Validor,
  login_Validator,
} = require("../utils/ValidatorsRules/authValidator");
const {
  signup,
  login,
  forgetPassword,
  verifyResetPassword,
  resetPassword,
} = require("../controllers/authControllers");

router.post("/signup", signUp_Validor, signup);

router.post("/login", login_Validator, login);
router.post("/forgotPassword", forgetPassword);
router.post("/verifPassword", verifyResetPassword);
router.put("/resetPassword", resetPassword);

module.exports = router;
