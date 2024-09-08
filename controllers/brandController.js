const asyncHandler = require("express-async-handler");
const Brand = require("../models/BrandModel");
const ErrorHandler = require("../utils/ErrorHandler");
const APIFeatures = require("../utils/APIFeatures");
const handlersFactory = require("../services/handlersFactory");

// @desc    Get all brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = handlersFactory.getAll(Brand);

// @desc    Get a single brand by id
// @route   GET /api/v1/brand/:id
// @access  Public
exports.getBrand = handlersFactory.getOne(Brand);

// @desc    Create a new brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = handlersFactory.createOne(Brand);

// @desc    Update brand
// @route   PUT /api/v1/brand/:id
// @access  Private
exports.updateBrand = handlersFactory.updateOne(Brand);

// @desc    Delete a brand
// @route   DELETE /api/v1/brandss/:id
// @access  Private
exports.deleteBrand = handlersFactory.deleteOne(Brand);
