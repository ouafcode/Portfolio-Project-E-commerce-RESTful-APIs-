const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const handler = require("./handlers");
const BrandMd = require("../models/brand");
const { uploadSingleImg } = require("../middlware/UploadImgHandling");

// to upload single image
exports.uploadImgBrand = uploadSingleImg("image");

// to process image (resize, change type ..)
exports.resizeImg = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploadImg/brand/${filename}`);

    // to save img to Database
    req.body.image = filename;
  }

  next();
});
// @descp  GET list brands
// @route  GET /api/v1/brands
// @access Public(users , admin)
exports.get_Brands = handler.getAllHandler(BrandMd);

// @descp  GET specific brand by id
// @route  GET /api/v1/brands/:id
// @access Public(users , admin)
exports.getBrand_id = handler.getHandler(BrandMd);

// @descp  Create brand
// @route  POST /api/v1/brands
// @access Private(admin)
exports.create_Brand = handler.createHandler(BrandMd);

// @descp  Update brand
// @route  PUT /api/v1/brands/:id
// @access Private(admin)
exports.up_Brand = handler.updateHandler(BrandMd);

// @descp  Delete brand
// @route  DELETE /api/v1/brands/:id
// @access Private(admin)
exports.del_Brand = handler.deleteHandler(BrandMd);
