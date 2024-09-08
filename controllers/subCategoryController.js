const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/SubCategoryModel");
const ErrorHandler = require("../utils/ErrorHandler");
const APIFeatures = require("../utils/APIFeatures");
const handlersFactory = require("../services/handlersFactory");

// @desc    Get all subCategories by category -> nested route
// @route   GET /api/v1/categories/:categoryId/sub-categories
// @access  Public
// filter middleware for getting all subCategories by category
exports.getAllSubCategoriesByCategoryFilter = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  req.filterObj = filter;
  next();
};

// @desc    Get all subCategories
// @route   GET /api/v1/sub-categories
// @access  Public
exports.getAllSubCategories = handlersFactory.getAll(SubCategory);

// @desc    Get a single sub category by id
// @route   GET /api/v1/sub-categories/:id
// @access  Public
exports.getSubCategory = handlersFactory.getOne(SubCategory);

// set category to the parent category if not provided (middleware)
exports.setCategoryIdToParent = (req, res, next) => {
  if (!req.body.category) {
    req.body.category = req.params.categoryId;
  }
  next();
};

// @desc    Create a new sub category
// @route   POST /api/v1/sub-categories
// @access  Private

// @desc    Create a new sub category by category -> nested route
// @route   POST /api/v1/categories/:categoryId/sub-categories
// @access  Private
exports.createSubCategory = handlersFactory.createOne(SubCategory);

// @desc    Update sub category
// @route   PUT /api/v1/sub-categories/:id
// @access  Private
exports.updateSubCategory = handlersFactory.updateOne(SubCategory);

// @desc    Delete a sub category
// @route   DELETE /api/v1/sub-categories/:id
// @access  Private
exports.deleteSubCategory = handlersFactory.deleteOne(SubCategory);