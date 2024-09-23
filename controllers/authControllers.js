const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const ApiErr = require("../utils/ApiErr");
const userMd = require("../models/user");
const sendMail = require("../utils/senEmail");

// @descp  Signup
// @route  POST /api/v1/auth/signup
// @access Public
exports.signup = asyncHandler(async (req, res, next) => {
  // Create user
  const user = await userMd.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  const token = generateToken(user._id);
  res.status(201).json({ data: user, token });
});

// @descp  Login
// @route  POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await userMd.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiErr("incorrect email or password", 401));
  }

  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});
// @descp check if user is logged
exports.auth = asyncHandler(async (req, res, next) => {
  // check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiErr(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }
  // check if token is valid
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  // check if user exist
  const checkUser = await userMd.findById(decodedToken.userId);
  if (!checkUser) {
    return next(new ApiErr("User doesn't exist for this token", 401));
  }
  // check if user change password after token created
  if (checkUser.passChangedAt) {
    const passChangedTime = parseInt(
      checkUser.passChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTime > decodedToken.iat) {
      return next(
        new ApiErr("User has changed password , please login again ", 401)
      );
    }
  }

  req.user = checkUser;
  next();
});
// @descp cuser permission
exports.permission = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiErr("You don't have permission to access this route", 403)
      );
    }
    next();
    // access to roles
    // acces to user
  });

// @descp  Forgot Password
// @route  POST /api/v1/auth/forgotPassword
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // load user via email
  const user = await userMd.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiErr(`there is no user for this email ${req.body.email}`, 404)
    );
  }
  // Generate random digit and save it in database
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(randomCode)
    .digest("hex");

  user.passResetCode = hashedCode;
  user.passResetExpired = Date.now() + 10 * 60 * 1000;
  user.passResetVerified = false;
  await user.save();
  // send the reset code by email

  const message = `Hi ${user.name},\n If you requested a password reset , use the confirmation code below to complete the process.\n ${randomCode}`;

  try {
    await sendMail({
      email: user.email,
      subject: "Your password reset code",
      message,
    });
  } catch (err) {
    user.passResetCode = undefined;
    user.passResetExpired = undefined;
    user.passResetVerified = undefined;

    await user.save();
    return next(new ApiErr("error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: " Reset code send to email" });
});

exports.verifyResetPassword = asyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");

  const user = await userMd.findOne({
    passResetCode: hashedCode,
    passResetExpired: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiErr("Reste code is invalid"));
  }

  user.passResetVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userMd.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiErr(`No user with this email ${req.body.email}`));
  }
  if (!user.passResetVerified) {
    return next(new ApiErr("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;

  user.passResetCode = undefined;
  user.passResetExpired = undefined;
  user.passResetVerified = undefined;

  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({ token });
});
