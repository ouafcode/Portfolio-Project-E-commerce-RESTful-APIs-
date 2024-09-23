const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const { check, body } = require("express-validator");
const validate = require("../../middlware/validatorHandling");
const userMd = require("../../models/user");

exports.getUser_Validator = [
  check("id").isMongoId().withMessage("wrong user id"),
  validate,
];

exports.createUser_Validor = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3 })
    .withMessage("Minimum three caracter")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      userMd.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("minimum six caracter")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),

  check("profilePicture").optional(),
  check("role").optional(),
  check("phonenumber")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),
  validate,
];

exports.upUser_Validator = [
  check("id").isMongoId().withMessage("wrong user id"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      userMd.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("profilePicture").optional(),
  check("role").optional(),
  check("phonenumber")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),

  validate,
];

exports.upUserPassword_Validator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Please enter your current password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your password confirm"),
  check("password")
    .notEmpty()
    .withMessage("Please enter new password")
    .custom(async (val, { req }) => {
      const user = await userMd.findById(req.params.id);
      if (!user) {
        throw new Error("No user for this id ");
      }
      const isPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isPassword) {
        throw new Error("current password is incorrect");
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirm incorrect");
      }
      return true;
    }),
  validate,
];

exports.delUser_Validator = [
  check("id").isMongoId().withMessage("wrong user id"),
  validate,
];

exports.upUserLogged_Validator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email")
    .custom((val) =>
      userMd.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("phonenumber")
    .optional()
    .isMobilePhone("ar-MA")
    .withMessage("Invalid phone number"),

  validate,
];
