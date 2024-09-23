const express = require("express");

const router = express.Router();

const subcategoryApi = require("./subcategoryApi");

const authController = require("../controllers/authControllers");

router.use("/:categoryId/subcategories", subcategoryApi);

const {
  getBrand_Validator,
  createBrand_Validor,
  upBrand_Validator,
  delBrand_Validator,
} = require("../utils/ValidatorsRules/brandValidator");
const {
  get_Brands,
  create_Brand,
  getBrand_id,
  up_Brand,
  del_Brand,
  uploadImgBrand,
  resizeImg,
} = require("../controllers/brandControllers");

router
  .route("/")
  .get(get_Brands)
  .post(
    authController.auth,
    authController.permission("admin", "manager"),
    uploadImgBrand,
    resizeImg,
    createBrand_Validor,
    create_Brand
  );
router
  .route("/:id")
  .get(getBrand_Validator, getBrand_id)
  .put(
    authController.auth,
    authController.permission("admin", "manager"),
    uploadImgBrand,
    resizeImg,
    upBrand_Validator,
    up_Brand
  )
  .delete(
    authController.auth,
    authController.permission("admin"),
    delBrand_Validator,
    del_Brand
  );

module.exports = router;
