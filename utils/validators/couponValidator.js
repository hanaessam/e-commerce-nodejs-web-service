const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isLength({ min: 3 })
    .withMessage("Coupon name must be at least 3 characters long"),
  check("expiresAt")
    .notEmpty()
    .withMessage("Coupon expire date is required")
    .isDate()
    .withMessage("Invalid date format"),
  check("discount")
    .notEmpty()
    .withMessage("Coupon discount is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Coupon discount must be between 0 and 100"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Coupon name must be at least 3 characters long"),
  check("expiresAt")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),
  check("discount")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Coupon discount must be between 0 and 100"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  validatorMiddleware,
];