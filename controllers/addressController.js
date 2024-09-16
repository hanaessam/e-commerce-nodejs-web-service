
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");


// @desc    Add product to Addresses
// @route   POST /api/v1/addresses
// @access  Private/Protected/User
exports.addToAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.addresses,
    message: "Address added to Addresses successfully",
  });
});

// @desc    Remove product from Addresses
// @route   DELETE /api/v1/addresses/:addressId
// @access  Private/Protected/User
exports.removeFromAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: {_id: req.params.addressId} },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: user.addresses,
    message: "Address removed from Addresses successfully",
  });
});


// @desc    Get logged user Addresses
// @route   GET /api/v1/Addresses
// @access  Private/Protected/User
exports.getAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});