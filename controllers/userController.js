const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const APIError = require("../utils/APIError");
const factory = require("../services/handlersFactory");
const User = require("../models/userModel");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const generateToken = require("../utils/generateToken");

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = factory.getAll(User);

// @desc    Get specific user by id
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = factory.getOne(User);

// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private
exports.createUser = factory.createOne(User);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      profileImg: req.body.profileImg,
      active: req.body.active,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new APIError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Change password
// @route   PUT /api/v1/users/change-password
// @access  Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new APIError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = factory.deleteOne(User);

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeUserImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);
  // save image name to db
  req.body.image = fileName;
  next();
});

// @desc    Get logged user data (me)
// @route   GET /api/v1/users/me
// @access  Private/Protected
exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT /api/v1/users/me/change-password
// @access  Private/Protected
exports.updateMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new APIError(`No user with this id ${req.params.id}`, 404));
  }
  const token = generateToken(user._id);

  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data
// @route   PUT /api/v1/users/me
// @access  Private/Protected
exports.updateMe = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );

  if (!updatedUser) {
    return next(new APIError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: updatedUser });
});


// @desc  deactivate logged user
// @route DELETE /api/v1/users/me
// @access Private/Protected
exports.deactivateMe = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
  );
  if (!user) {
    return next(new APIError(`No user with this id ${req.params.id}`, 404));
  }
  res.status(204).json({ data: user });
});


// @desc    Activate user
// @route   PUT /api/v1/users/activate/:id
// @access  Private/Admin
exports.activateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { active: true },
    { new: true }
  );

  if (!user) {
    return next(new APIError(`No user with this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: user });
});