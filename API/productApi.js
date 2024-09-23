const express = require("express");

const authController = require("../controllers/authControllers");

const router = express.Router();

const {
  get_ProductValidator,
  crt_ProductValidator,
  up_ProductValidator,
  del_ProductValidator,
} = require("../utils/ValidatorsRules/productValidator");
const {
  get_Products,
  create_Product,
  getProduct_id,
  up_Product,
  del_Product,
  uploadImgProducts,
  resizeImgProducts,
} = require("../controllers/productControllers");

router
  .route("/")
  .get(get_Products)
  .post(
    authController.auth,
    authController.permission("admin", "manager"),
    uploadImgProducts,
    resizeImgProducts,
    crt_ProductValidator,
    create_Product
  );
router
  .route("/:id")
  .get(get_ProductValidator, getProduct_id)
  .put(
    authController.auth,
    authController.permission("admin", "manager"),
    uploadImgProducts,
    resizeImgProducts,
    up_ProductValidator,
    up_Product
  )
  .delete(
    authController.auth,
    authController.permission("admin"),
    del_ProductValidator,
    del_Product
  );

module.exports = router;
