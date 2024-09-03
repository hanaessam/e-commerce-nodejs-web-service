const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/CategoryModel");
const ErrorHandler = require("../ErrorHandler");
const SubCategory = require("../../models/SubCategoryModel");
const Brand = require("../../models/BrandModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Product priceAfterDiscount must be less than the product price"
        );
      }
      return true;
    }),
  check("models")
    .optional()
    .isArray()
    .withMessage("Product models must be an array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid Category ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`Category with ID: ${categoryId} not found`)
          );
        }
      })
    ),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error(`Invalid subcategories Ids`));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          // check if subcategories ids in db include subcategories in req.body (true)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid Brand ID format")
    .custom((brandId) =>
      Brand.findById(brandId).then((brand) => {
        if (!brand) {
          return Promise.reject(
            new Error(`Brand with ID: ${brandId} not found`)
          );
        }
      })
    ),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsAverage must be a number")
    .isLength({ max: 5 })
    .withMessage("Product ratingsAverage must be at most 5 characters long"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
];
