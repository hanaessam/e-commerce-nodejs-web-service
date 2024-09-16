const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");
const APIError = require("../APIError");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("product")
    .notEmpty()
    .withMessage("Product is required")
    .isMongoId()
    .withMessage("Invalid Product id format"),
  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Invalid User id format")
    .custom(async (value, { req }) => {
      // Check if logged user created a review before
      const review = await Review.findOne({
        user: req.body.user,
        product: req.body.product,
      });
      if (review) {
        return Promise.reject(
          new APIError("You have already reviewed this product")
        );
      }
      return true;
    }),
  check("comment").optional(),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (value, { req }) => {
      const review = await Review.findById(value);
      if (!review) {
        return Promise.reject(new APIError("Review not found", 404));
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new APIError("You are not allowed to update this review")
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (value, { req }) => {
      if (req.user.role === "user") {
        const review = await Review.findById(value);
        if (!review) {
          return Promise.reject(new APIError("Review not found", 404));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new APIError("You are not allowed to delete this review")
          );
        }
      }
      return true;
    }),
  validatorMiddleware,
];
