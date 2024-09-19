const slugify = require("slugify");
const { check, body } = require("express-validator");
const validate = require("../../middlware/validatorHandling");

exports.getCategory_Validator = [
  check("id").isMongoId().withMessage("wrong category id"),
  validate,
];

exports.createCategory_Validor = [
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

exports.upCategory_Validator = [
  check("id").isMongoId().withMessage("wrong category id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validate,
];

exports.delCategory_Validator = [
  check("id").isMongoId().withMessage("wrong category id"),
  validate,
];
