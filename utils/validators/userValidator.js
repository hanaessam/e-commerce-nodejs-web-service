const slugify = require("slugify");
const bcrypt = require("bcrypt");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty() 
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Too short user password"),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  check("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number, must be Egyptian number"),

  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("New password is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Current password is incorrect");
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error(
          "New password must be different from the current password"
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number, must be Egyptian number"),

  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
