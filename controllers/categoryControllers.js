//const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const categoryMd = require("../models/category");
const handler = require("./handlers");
// const ApiErr = require("../utils/ApiErr");
const { uploadSingleImg } = require("../middlware/UploadImgHandling");

// to upload single image
exports.uploadImgCategory = uploadSingleImg("image");

// to process image (resize, change type ..)
exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploadImg/category/${filename}`);

  // to save img to Database
  req.body.image = filename;

  next();
});

// @descp  GET list category
// @route  GET /api/v1/categoryAPI
// @access Public(users , admin)
exports.get_Category = handler.getAllHandler(categoryMd);

// @descp  GET specific category by id
// @route  GET /api/v1/categoryAPI/:id
// @access Public(users , admin)
exports.getCategory_id = handler.getHandler(categoryMd);

// @descp  Create category
// @route  POST /api/v1/categoryAPI
// @access Private(admin)
exports.create_Category = handler.createHandler(categoryMd);

// @descp  Update category
// @route  PUT /api/v1/categories/:id
// @access Private(admin)
exports.up_Category = handler.updateHandler(categoryMd);

// @descp  Delete category
// @route  DELETE /api/v1/categoryAPI
// @access Private(admin)

exports.del_Category = handler.deleteHandler(categoryMd);
