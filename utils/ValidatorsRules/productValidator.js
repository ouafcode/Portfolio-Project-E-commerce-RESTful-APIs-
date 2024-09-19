const slugify = require("slugify");
const { check, body } = require("express-validator");
const validate = require("../../middlware/validatorHandling");
const categoryMd = require("../../models/category");
const Sub_categoryMd = require("../../models/subCategory");

// Validator for product creation
exports.crt_ProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be minimum 3 chars")
    .notEmpty()
    .withMessage("Product title is required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Maximum 2000 caracter"),
  check("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity must be a number"),
  check("soldCounter")
    .optional()
    .isNumeric()
    .withMessage("sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceDisc")
    .optional()
    .isNumeric()
    .withMessage("price after discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of string"),
  check("imageCover").notEmpty().withMessage("imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be attached to category")
    .isMongoId()
    .withMessage("Invalid ID")
    .custom((value) =>
      categoryMd.findById(value).then((category) => {
        if (!category) {
          return Promise.reject(new Error(`No category for this id: ${value}`));
        }
      })
    ),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID")
    .custom((value) =>
      Sub_categoryMd.find({
        _id: { $exists: true, $in: value },
      }).then((result) => {
        if (result.length < 1 || result.length !== value.length) {
          return Promise.reject(new Error(`Invalid subcategory Id`));
        }
      })
    )
    .custom((val, { req }) =>
      Sub_categoryMd.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesId = [];
          subcategories.forEach((subCategory) => {
            subCategoriesId.push(subCategory._id.toString());
          });
          // check if subcategories ids include subcategories in req.body
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesId)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID"),
  check("rateAverage")
    .optional()
    .isNumeric()
    .withMessage("rateAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("rateQuantity")
    .optional()
    .isNumeric()
    .withMessage("rateQuantity must be a number"),

  validate,
];

exports.get_ProductValidator = [
  check("id").isMongoId().withMessage("Invalid id "),
  validate,
];

exports.up_ProductValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validate,
];

exports.del_ProductValidator = [
  check("id").isMongoId().withMessage("Invalid id"),
  validate,
];
