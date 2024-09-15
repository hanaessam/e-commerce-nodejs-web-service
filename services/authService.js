const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const APIError = require("../utils/APIError");
const User = require("../models/userModel");

const generateToken = (payload) => {
  const token = jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

// @desc    Sign up user
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // generate token
  const token = generateToken(user._id);

  // send response
  res.status(201).json({
    token,
    data: {
      user,
    },
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // check if user exists && password is correct
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new APIError("Incorrect email or password", 401));
  }

  // generate token
  const token = generateToken(user._id);

  // send response
  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});