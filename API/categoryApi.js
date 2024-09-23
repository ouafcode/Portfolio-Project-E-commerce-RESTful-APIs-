const express = require("express");

const router = express.Router();

const subcategoryApi = require("./subcategoryApi");

const authController = require("../controllers/authControllers");

router.use("/:categoryId/subcategories", subcategoryApi);

const {
  getCategory_Validator,
  createCategory_Validor,
  upCategory_Validator,
  delCategory_Validator,
} = require("../utils/ValidatorsRules/categoryValidator");
const {
  get_Category,
  create_Category,
  getCategory_id,
  up_Category,
  del_Category,
  uploadImgCategory,
  resizeImg,
} = require("../controllers/categoryControllers");

router
  .route("/")
  .get(get_Category)
  .post(
    authController.auth,
    authController.permission("admin", "manager"),
    uploadImgCategory,
    resizeImg,
    createCategory_Validor,
    create_Category
  );
router
  .route("/:id")
  .get(getCategory_Validator, getCategory_id)
  .put(
    authController.auth,
    authController.permission("admin", "manager"),
    uploadImgCategory,
    resizeImg,
    upCategory_Validator,
    up_Category
  )
  .delete(
    authController.auth,
    authController.permission("admin"),
    delCategory_Validator,
    del_Category
  );

module.exports = router;
