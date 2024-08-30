const asyncHandler = require("express-async-handler");
const Brand = require("../models/BrandModel");
const ErrorHandler = require("../utils/ErrorHandler");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const brands = await Brand.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

// @desc    Get a single brand by id
// @route   GET /api/v1/brand/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new ErrorHandler(404, `Brand with id ${id} not found`));
  }
  res.status(200).json({ data: brand });
});

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name });
  res.status(201).json({ data: brand });
});

// @desc    Update brand
// @route   PUT /api/v1/brand/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await Brand.findOneAndUpdate(
    { _id: id },
    { name: name },
    { new: true }
  );
  if (!brand) {
    return next(new ErrorHandler(404, `Brand with id ${id} not found`));
  }
  res.status(200).json({ data: brand });
});

// @desc    Delete a brand
// @route   DELETE /api/v1/brandss/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ErrorHandler(404, `Brand with id ${id} not found`));
  }
  res.status(204).send();
});
