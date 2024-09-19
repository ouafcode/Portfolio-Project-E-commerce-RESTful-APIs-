const slugify = require("slugify");
const { check, body } = require("express-validator");
const validate = require("../../middlware/validatorHandling");

exports.getBrand_Validator = [
  check("id").isMongoId().withMessage("wrong brand id"),
  validate,
];

exports.createBrand_Validor = [
  check("name")
    .notEmpty()
    .withMessage("Category name required")
    .isLength({ min: 3 })
    .withMessage("Minimum three caracter")
    .isLength({ max: 32 })
    .withMessage("Maximum 32 caracter")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validate,
];

exports.upBrand_Validator = [
  check("id").isMongoId().withMessage("wrong brand id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validate,
];

exports.delBrand_Validator = [
  check("id").isMongoId().withMessage("wrong brand id"),
  validate,
];
