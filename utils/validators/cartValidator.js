const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format"),
  check("model")
    .optional()
    .isString()
    .withMessage("Model must be a string"),
  check("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  validatorMiddleware,
];

exports.applyCouponValidator = [
  check("coupon")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isString()
    .withMessage("Coupon name must be a string"),
  validatorMiddleware,
];

exports.updateCartValidator = [
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  validatorMiddleware,
];

exports.removeFromCartValidator = [
  check("itemId")
    .isMongoId()
    .withMessage("Invalid Item ID format"),
  validatorMiddleware,
];