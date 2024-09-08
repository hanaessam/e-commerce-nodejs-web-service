const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const factory = require('../services/handlersFactory');
const Brand = require('../models/brandModel');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

// @desc    Get list of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = factory.getAll(Brand);

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand);

// @desc    Create brand
// @route   POST  /api/v1/brands
// @access  Private
exports.createBrand = factory.createOne(Brand);

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand);


exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage =  asyncHandler(async (req, res, next) => {
    if (!req.file) return next();
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);
    // save image name to db
    req.body.image = fileName;
    next();
  });