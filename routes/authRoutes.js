const express = require("express");

const { signUpValidator, logInValidator } = require("../utils/validators/authValidator");

const { signup, login, forgotPassword, verifyResetCode, resetPassword } = require("../services/authService");

const router = express.Router();

router.route("/signup").post(signUpValidator, signup);
router.route("/login").post(logInValidator, login);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-password-reset-code").post(verifyResetCode);
router.route("/reset-password").put(resetPassword);

module.exports = router;