const asyncHandler = require("express-async-handler");
const SubCategory = require("../models/SubCategoryModel");
const ErrorHandler = require("../utils/ErrorHandler");

// @desc    Get all subCategories by category -> nested route
// @route   GET /api/v1/categories/:categoryId/sub-categories
// @access  Public
// filter middleware for getting all subCategories by category
exports.getAllSubCategoriesByCategoryFilter =  (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) {
    filter = { category: req.params.categoryId };
  }
  req.filterObj = filter;
  next();
}


// @desc    Get all subCategories
// @route   GET /api/v1/sub-categories
// @access  Public
exports.getAllSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1; // * 1 to convert from string to number
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const subCategories = await SubCategory.find(req.filterObj).skip(skip).limit(limit).populate({ path: "category", select: "name" });
  res.status(200).json({ results: subCategories.length, page, data: subCategories });
});

// @desc    Get a single sub category by id
// @route   GET /api/v1/sub-categories/:id
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!subCategory) {
    return next(new ErrorHandler(404, `Sub-Category with id ${id} not found`));
  }
  res.status(200).json({ data: subCategory });
});

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
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, category } = req.body;
  if(!category) {
    req.body.category = categoryId;
  }
  const subCategory = await SubCategory.create({ name, category });
  res.status(201).json({ data: subCategory });
});

// @desc    Update sub category
// @route   PUT /api/v1/sub-categories/:id
// @access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name: name, category },
    { new: true }
  ).populate({ path: "category", select: "name" });
  if (!subCategory) {
    return next(new ErrorHandler(404, `Sub-Category with id ${id} not found`));
  }
  res.status(200).json({ data: subCategory });
});

// @desc    Delete a sub category
// @route   DELETE /api/v1/sub-categories/:id
// @access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ErrorHandler(404, `Sub-Category with id ${id} not found`));
  }
  res.status(204).send();
});
