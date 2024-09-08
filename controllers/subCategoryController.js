const factory = require('../services/handlersFactory');
const SubCategory = require('../models/subCategoryModel');

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

// @desc    Get list of sub-categories
// @route   GET /api/v1/sub-categories
// @access  Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc    Get specific sub-category by id
// @route   GET /api/v1/sub-categories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory);

// @desc    Create subCategory
// @route   POST  /api/v1/sub-categories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Update specific subcategory
// @route   PUT /api/v1/sub-categories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete specific subCategory
// @route   DELETE /api/v1/sub-categories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
