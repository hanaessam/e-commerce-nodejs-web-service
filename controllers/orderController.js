const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const APIError = require("../utils/APIError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// @desc    Create Cash Order
// @route   POST /api/orders/cartId
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const tax = 0; // => app settings from admin
  const shipping = 0;
  // 1- get cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new APIError("Cart not found", 404));
  }

  // 2- get price of order from cart (check if there's a coupon applied)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + tax + shipping;
  // 3- create order with default payment type cash
  const order = await Order.create({
    user: req.user._id,
    items: cart.items,
    tax,
    shipping,
    totalPrice: totalOrderPrice,
  });
  // 4- update product quantity+ and sold-
  // increment the product quantity and decrement the sold using bulkWrite

  const bulkOptions = cart.items.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOptions, {});
  // 5- clear cart

  await Cart.findByIdAndDelete(req.params.cartId);
  res.status(201).json({
    status: "success",
    data: order,
  });
});
