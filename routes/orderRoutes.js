const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getOrderById,
  filterOrderForLoggedUser,
  updateOrderToDelivered,
  updateOrderToPaid,
  getCheckoutSession,
  getMyOrders
} = require("../controllers/orderController");
const authService = require("../services/authService");
const {
  createOrderValidator,
  getOrderByIdValidator,
  updateOrderStatusValidator,
} = require("../utils/validators/orderValidator");

const router = express.Router();

router.use(authService.protect);

router.get("/my-orders", authService.allowedTo("user"), getMyOrders);

router.post("/:cartId",authService.allowedTo("user"),createOrderValidator,createCashOrder
);
router.get( "/",authService.allowedTo("admin", "manager"),
filterOrderForLoggedUser,getAllOrders);

router.route("/:id").get(getOrderByIdValidator, getOrderById);

router.put(
  "/:id/delivered",authService.allowedTo("admin", "manager"),
  updateOrderStatusValidator,updateOrderToDelivered);

router.put(
"/:id/paid", authService.allowedTo("admin", "manager"),
updateOrderStatusValidator,updateOrderToPaid);

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  getCheckoutSession
);

module.exports = router;