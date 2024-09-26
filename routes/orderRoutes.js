const express = require("express");
const {
  createCashOrder
} = require("../controllers/orderController");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));
router.post("/:cartId", createCashOrder);

module.exports = router;
