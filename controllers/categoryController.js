const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");
const ErrorHandler = require("../utils/ErrorHandler");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1; // * 1 to convert from string to number
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const categories = await Category.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @desc    Get a single category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ErrorHandler(404, `Category with id ${id} not found`));
  }
  res.status(200).json({ data: category });
});

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name });
  res.status(201).json({ data: category });
});

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findOneAndUpdate(
    { _id: id },
    { name: name },
    { new: true }
  );
  if (!category) {
    return next(new ErrorHandler(404, `Category with id ${id} not found`));
  }
  res.status(200).json({ data: category });
});

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ErrorHandler(404, `Category with id ${id} not found`));
  }
  res.status(204).send();
});
