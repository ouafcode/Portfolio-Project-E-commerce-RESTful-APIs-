const express = require("express");

const authController = require("../controllers/authControllers");

const router = express.Router({ mergeParams: true });

const {
  create_subCategory,
  get_subcategory,
  getsubcategory_id,
  up_subcategory,
  del_subcategory,
  Set_CategoryidBody,
  create_filterobj,
} = require("../controllers/subcategoryControllers");
const {
  createSubCategory_Validor,
  getSubCategory_Validator,
  upSubCategory_Validator,
  delSubCategory_Validator,
} = require("../utils/ValidatorsRules/subcategoryValidator");

router
  .route("/")
  .post(
    authController.auth,
    authController.permission("admin", "manager"),
    Set_CategoryidBody,
    createSubCategory_Validor,
    create_subCategory
  )
  .get(create_filterobj, get_subcategory);
router
  .route("/:id")
  .get(getSubCategory_Validator, getsubcategory_id)
  .put(
    authController.auth,
    authController.permission("admin", "manager"),
    upSubCategory_Validator,
    up_subcategory
  )
  .delete(
    authController.auth,
    authController.permission("admin"),
    delSubCategory_Validator,
    del_subcategory
  );

module.exports = router;
