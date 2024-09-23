const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const handler = require("./handlers");
const userMd = require("../models/user");
const generateToken = require("../utils/generateToken");
const ApiErr = require("../utils/ApiErr");
const { uploadSingleImg } = require("../middlware/UploadImgHandling");

// to upload single image
exports.uploadImgUser = uploadSingleImg("profilePicture");

// to process image (resize, change type ..)
exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploadImg/user/${filename}`);

    // to save img to Database
    req.body.profilePicture = filename;
  }

  next();
});
// @descp  GET list users
// @route  GET /api/v1/users
// @access Private(admin)
exports.get_Users = handler.getAllHandler(userMd);

// @descp  GET specific user by id
// @route  GET /api/v1/users/:id
// @access Private(admin)
exports.getUser_id = handler.getHandler(userMd);

// @descp  Create user
// @route  POST /api/v1/users
// @access Private(admin)
exports.create_User = handler.createHandler(userMd);

// @descp  Update user
// @route  PUT /api/v1/users/:id
// @access Private(admin)
exports.up_User = asyncHandler(async (req, res, next) => {
  const doc = await userMd.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!doc) {
    return next(new ApiErr(`wrong id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: doc });
});

exports.up_UserPassword = asyncHandler(async (req, res, next) => {
  const doc = await userMd.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!doc) {
    return next(new ApiErr(`wrong id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: doc });
});

// @descp  Delete user
// @route  DELETE /api/v1/users/:id
// @access Private(admin)
exports.del_User = handler.deleteHandler(userMd);

// @descp  Get logged user data
// @route  GET /api/v1/users/getdata
// @access Private(admin)
exports.getUserLogged = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @descp  Update logged user Password
// @route  PUT /api/v1/users/UpdatePassword
// @access Private(admin)
exports.updateUserLogged = asyncHandler(async (req, res, next) => {
  const user = await userMd.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = generateToken(user._id);
  res.status(200).json({ data: user, token });
});

// @descp  Update logged user data
// @route  PUT /api/v1/users/UpdateData
// @access Private(admin)
exports.updateUserLoggedData = asyncHandler(async (req, res, next) => {
  const loggedUser = await userMd.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phonenumber,
    },
    { new: true }
  );
  res.status(200).json({ data: loggedUser });
});

// @descp  Deactivate logged User
// @route  DELETE /api/v1/users/Deactivate
// @access Private(admin)
exports.DeactivateUser = asyncHandler(async (req, res, next) => {
  await userMd.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "success" });
});
