const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// Array of validation rules for each route/request
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Sub-Category name is required")
    .isString()
    .withMessage("Sub-Category name must be a string")
    .isLength({ min: 2 })
    .withMessage("Sub-Category name must be at least 2 characters long"),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Category ID format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Sub-Category ID format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Sub-Category ID format"),
  validatorMiddleware,
];
