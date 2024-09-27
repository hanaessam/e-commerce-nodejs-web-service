const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const APIError = require("../utils/APIError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const factory = require("../services/handlersFactory");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
    shippingAddress: req.body.shippingAddress,
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

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    Get All Orders
// @route   GET /api/orders
// @access  Protected/Admin-Manager
exports.getAllOrders = factory.getAll(Order);

// @desc    Get Order By Id
// @route   GET /api/orders/:id
// @access  Protected/User-Admin-Manager
exports.getOrderById = factory.getOne(Order);

// @desc    Update Paid Status of Order
// @route   PUT /api/orders/:id/paid
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new APIError(`No order is found with this id ${req.params.id}`, 404)
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  const updatedOrder = await order.save();

  res.status(200).json({ message: "Order is paid!", data: updatedOrder });
});

// @desc    Update Delivered Status of Order
// @route   PUT /api/orders/:id/delivered
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new APIError(`No order is found with this id ${req.params.id}`, 404)
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();
  res.status(200).json({ message: "Order is delivered!", data: updatedOrder });
});

// @desc    Get checkout session for stripe
// @route   GET /api/orders/checkout-session/:cartId
// @access  Protected/User
exports.getCheckoutSession = asyncHandler(async (req, res, next) => {
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

 
  // 3- create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1, // => x1 of whole order (leave it 1)
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart/`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4- send session
  res.status(200).json({
    status: "success",
    data: session,
  });
});


// @desc    Webhook endpoint for stripe
// @route   POST /api/orders/webhook
// @access  Public

//.. to be implemented when it's deployed
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if(event.type === 'checkout.session.completed') {
    console.log("Create Order here");
    
  }
});