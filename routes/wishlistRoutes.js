const express = require("express");
const authService = require("../services/authService");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addToWishlist).get(getWishlist);
router.route("/:productId").delete(removeFromWishlist);

module.exports = router;
