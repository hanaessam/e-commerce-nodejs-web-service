const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createOrderValidator = [
  check("cartId")
    .notEmpty()
    .withMessage("Cart ID is required")
    .isMongoId()
    .withMessage("Invalid Cart ID format"),
  check("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required")
    .isString()
    .withMessage("Shipping address must be a string")
    .isLength({ min: 10 })
    .withMessage("Shipping address must be at least 10 characters long"),
  validatorMiddleware,
];

exports.getOrderByIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Order ID format"),
  validatorMiddleware,
];

exports.updateOrderStatusValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Order ID format"),
  validatorMiddleware,
];