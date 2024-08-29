const asyncHandler = require('express-async-handler');
const SubCategory = require('../models/SubCategoryModel');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Get all subCategories
// @route   GET /api/v1/sub-categories
// @access  Public
exports.getAllSubCategories = asyncHandler(async (req, res) => {
    const page = req.query.page * 1 || 1; // * 1 to convert from string to number
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const subCategories = await SubCategory.find({}).skip(skip).limit(limit).populate({path:'category', select:'name'});
    res.status(200).json({ results: subCategories.length, page, data: subCategories });
  });
  
  // @desc    Get a single sub category by id
  // @route   GET /api/v1/sub-categories/:id
  // @access  Public
  exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate({path:'category', select:'name'});
    if (!subCategory) {
      return next(new ErrorHandler(404, `Sub-Category with id ${id} not found`));
    }
    res.status(200).json({ data: subCategory });
  });
  
  // @desc    Create a new sub category
  // @route   POST /api/v1/sub-categories
  // @access  Private
  exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body;
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
    ).populate({path:'category', select:'name'});
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
    const category = await SubCategory.findByIdAndDelete(id);
    if (!category) {
      return next(new ErrorHandler(404, `Sub-Category with id ${id} not found`));
    }
    res.status(204).send();
  });
  