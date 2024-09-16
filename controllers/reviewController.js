const factory = require('../services/handlersFactory');
const Review = require('../models/reviewModel');


exports.setProductIdToBody = (req, res, next) => {
    // Nested route (Create)
    if (!req.body.product) req.body.product = req.params.productId;
    next();
  };

exports.setUserIdToBody = (req, res, next) => {
    // Nested route (Create)
    if (!req.body.user) req.body.user = req.user._id;
    next();
  };
  
  // Nested route
  // GET /api/v1/products/:productId/reviews
  exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
  };


// @desc    Get list of Reviews
// @route   GET /api/v1/Reviews
// @access  Public
exports.getReviews = factory.getAll(Review);

// @desc    Get specific Review by id
// @route   GET /api/v1/Reviews/:id
// @access  Public
exports.getReview = factory.getOne(Review);

// @desc    Create Review
// @route   POST  /api/v1/Reviews
// @access  Private/Protect/User
exports.createReview = factory.createOne(Review);

// @desc    Update specific Review
// @route   PUT /api/v1/Reviews/:id
// @access  Private/Protect/User
exports.updateReview = factory.updateOne(Review);

// @desc    Delete specific Review
// @route   DELETE /api/v1/Reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);

