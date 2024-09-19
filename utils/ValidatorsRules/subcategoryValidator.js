const slugify = require("slugify");
const { check, body } = require("express-validator");
const validate = require("../../middlware/validatorHandling");

exports.getSubCategory_Validator = [
  check("id").isMongoId().withMessage("wrong Subcategory id"),
  validate,
];

exports.createSubCategory_Validor = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("Minimum two caracter")
    .isLength({ max: 32 })
    .withMessage("Maximum 32 caracter")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category required")
    .isMongoId()
    .withMessage("Invalid category id"),
  validate,
];

exports.upSubCategory_Validator = [
  check("id").isMongoId().withMessage("wrong Subcategory id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validate,
];

exports.delSubCategory_Validator = [
  check("id").isMongoId().withMessage("wrong Subcategory id"),
  validate,
];
