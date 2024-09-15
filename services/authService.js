const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const APIError = require("../utils/APIError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

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

// @desc    Protect routes
// !!! Very important middleware to protect routes !!!
exports.protect = asyncHandler(async (req, res, next) => {
  // check if the token exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // get the token
    token = req.headers.authorization.split(" ")[1];

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //=> id, iat, exp (issued at, expires)

    // check if the user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new APIError(
          "The user belonging to this token does no longer exist",
          401
        )
      );
    }

    // check if the user changed password after the token was issued
    if (currentUser.passwordChangedAt) {
      // passwordChangedAt is the time when the password was last changed (date time not timpestamp)
      // (iat) issue at time is timestamp in seconds

      // get time stamp of passwordChangedAt in seconds (convert passwordChangedAt to a timestamp to compare them)
      const passwordChangedAtTimeStamp =
        currentUser.passwordChangedAt.getTime() / 1000; // get timestamp in seconds
      if (decoded.iat < passwordChangedAtTimeStamp) {
        return next(
          new APIError(
            "User recently changed password! Please login again",
            401
          )
        );
      }
    }

    // grant access to the protected route
    req.user = currentUser;
    next();
  } else {
    return next(
      new APIError("You are not logged in! Please login to get access", 401)
    );
  }
});

// @desc    Restrict routes to certain roles
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // access to the roles array
    // access the reigstered user role and compare it with the roles array
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError("You are not allowed to perform this action", 403)
      );
    }
  });

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new APIError(`There is no user with that email: ${req.body.email}`, 404)
    );
  }
  // if user exists, generate 6 digit random code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // encrypt the code with crypto
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save the code to the user document
  user.passwordResetCode = hashResetCode;
  user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000; // expires in 10 minutes
  user.passwordResetCodeVerified = false;

  await user.save();
  // send it to the user's email
  const message = `Hi ${user.name},\n\nYour password reset code is: ${resetCode}, valid for 10 minutes\n\nIf you didn't request this, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset code",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();
    return next(
      new APIError("There was an error sending the email. Try again later", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Password reset code sent to your email",
  });
});
