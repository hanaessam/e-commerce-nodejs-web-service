const express = require("express");

const { signUpValidator, logInValidator } = require("../utils/validators/authValidator");

const { signup, login } = require("../services/authService");

const router = express.Router();

router.route("/signup").post(signUpValidator, signup);
router.route("/login").post(logInValidator, login);

module.exports = router;