const express = require("express");
const {
  addToCartValidator,
  applyCouponValidator,
  updateCartValidator,
  removeFromCartValidator,
} = require("../utils/validators/cartValidator");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCart,
  applyCoupon,
} = require("../controllers/cartController");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/")
  .post(addToCartValidator, addToCart)
  .get(getCart)
  .delete(clearCart);

router.route("/:itemId")
  .delete(removeFromCartValidator, removeFromCart)
  .put(updateCartValidator, updateCart);

router.route("/apply-coupon")
  .post(applyCouponValidator, applyCoupon);

module.exports = router;