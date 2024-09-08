const asyncHandler = require("express-async-handler");
const Category = require("../models/CategoryModel");
const ErrorHandler = require("../utils/ErrorHandler");
const APIFeatures = require("../utils/APIFeatures");
const handlersFactory = require("../services/handlersFactory");

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getAllCategories = handlersFactory.getAll(Category);

// @desc    Get a single category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = handlersFactory.getOne(Category);

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = handlersFactory.createOne(Category);

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = handlersFactory.updateOne(Category);

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = handlersFactory.deleteOne(Category);