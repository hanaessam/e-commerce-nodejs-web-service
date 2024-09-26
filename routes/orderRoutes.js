const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getOrderById,
  filterOrderForLoggedUser,
  updateOrderToDelivered,
  updateOrderToPaid,
} = require("../controllers/orderController");
const authService = require("../services/authService");

const router = express.Router();

router.post(
  "/:cartId",
  authService.protect,
  authService.allowedTo("user"),
  createCashOrder
);
router.get(
  "/",
  authService.protect,
  authService.allowedTo("admin", "manager"),
  filterOrderForLoggedUser,
  getAllOrders
);
router.route("/:id").get(getOrderById);

router.put(
  "/:id/delivered",
  authService.protect,
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);
router.put(
  "/:id/paid",
  authService.protect,
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid
);

module.exports = router;
