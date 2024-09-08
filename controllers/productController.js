const asyncHandler = require("express-async-handler");
const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/ErrorHandler");
const APIFeatures = require("../utils/APIFeatures");
const handlersFactory = require("../services/handlersFactory");

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getAllProducts = handlersFactory.getAll(Product, 'Products');

// @desc    Get a single product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = handlersFactory.getOne(Product);

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = handlersFactory.createOne(Product);

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = handlersFactory.updateOne(Product);

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = handlersFactory.deleteOne(Product);
