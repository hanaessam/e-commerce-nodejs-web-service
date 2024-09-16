const factory = require("../services/handlersFactory");

const Coupon = require("../models/couponModel");

// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Priavate/Protected/Admin-Manager
exports.getCoupons = factory.getAll(Coupon);


// @desc    Get specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Priavate/Protected/Admin-Manager
exports.getCoupon = factory.getOne(Coupon);


// @desc    Create coupon
// @route   POST  /api/v1/coupons
// @access  Priavate/Protected/Admin-Manager
exports.createCoupon = factory.createOne(Coupon);


// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Priavate/Protected/Admin-Manager
exports.updateCoupon = factory.updateOne(Coupon);


// @desc    Delete specific coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Priavate/Protected/Admin-Manager
exports.deleteCoupon = factory.deleteOne(Coupon);
