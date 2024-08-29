const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Array of validation rules for each route/request
exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isString()
    .withMessage("Category name must be a string")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID format"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID format"),
  validatorMiddleware,
];
