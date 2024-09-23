const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const productMd = require("../models/product");
const handler = require("./handlers");
const { UploadMultiImg } = require("../middlware/UploadImgHandling");

exports.uploadImgProducts = UploadMultiImg([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "image",
    maxCount: 5,
  },
]);

exports.resizeImgProducts = asyncHandler(async (req, res, next) => {
  // Img processing for image cover
  if (req.files.imageCover) {
    const imgCoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploadImg/product/${imgCoverfilename}`);

    // to save img to Database
    req.body.imageCover = imgCoverfilename;
  }
  // Img processing for single inage
  if (req.files.image) {
    req.body.image = [];
    await Promise.all(
      req.files.image.map(async (img, index) => {
        const imgName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploadImg/product/${imgName}`);

        // to save img to Database
        req.body.image.push(imgName);
      })
    );
  }
  next();
});
// @descp  GET list product
// @route  GET /api/v1/products
// @access Public(users , admin)
exports.get_Products = handler.getAllHandler(productMd, "Product");

// @descp  GET specific product by id
// @route  GET /api/v1/products/:id
// @access Public(users , admin)
exports.getProduct_id = handler.getHandler(productMd);

// @descp  Create product
// @route  POST /api/v1/products
// @access Private(admin)
exports.create_Product = handler.createHandler(productMd);

// @descp  Update product
// @route  PUT /api/v1/products
// @access Private(admin)
exports.up_Product = handler.updateHandler(productMd);

// @descp  Delete product
// @route  DELETE /api/v1/products
// @access Private(admin)
exports.del_Product = handler.deleteHandler(productMd);
