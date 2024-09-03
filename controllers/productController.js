const asyncHandler = require('express-async-handler');
const Product = require('../models/ProductModel');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const products = await Product.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: products.length, page, data: products });
});


// @desc    Get a single product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler(404, `Product with id ${id} not found`));
  }
  res.status(200).json({ data: product });
});



// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});


// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (!product) {
        return next(new ErrorHandler(404, `Product with id ${id} not found`));
    }
    res.status(200).json({ data: product });
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ErrorHandler(404, `Product with id ${id} not found`));
  }
  res.status(204).json();
});

