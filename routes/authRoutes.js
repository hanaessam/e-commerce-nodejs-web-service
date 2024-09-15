const express = require("express");

const { signUpValidator, logInValidator } = require("../utils/validators/authValidator");

const { signup, login, forgotPassword } = require("../services/authService");

const router = express.Router();

router.route("/signup").post(signUpValidator, signup);
router.route("/login").post(logInValidator, login);
router.route("/forgot-password").post(forgotPassword);

module.exports = router;