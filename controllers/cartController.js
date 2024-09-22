const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const APIError = require("../utils/APIError");
const Coupon = require("../models/couponModel");

// @desc    Calculate total price of cart
const calculateCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
};

// @desc    Add product to cart
// @route   POST /api/v1/cart
// @access  Private/Protected/User
exports.addToCart = asyncHandler(async (req, res, next) => {
  // get product from request body
  const { productId, model } = req.body;
  const product = await Product.findById(productId);
  // get cart for user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, model, price: product.price }],
    });
  } else {
    // if product exists in cart, update product's quantity
    const productExists = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.model === model
    );
    // if not, push product to cart items
    if (productExists > -1) {
      const cartItem = cart.items[productExists];
      cartItem.quantity += 1;
      cart.items[productExists] = cartItem;
    } else {
      cart.items.push({ product: productId, model, price: product.price });
    }
  }

  // calculate total price
  const totalPrice = calculateCartTotalPrice(cart);
  cart.totalPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.items.length,
    data: cart,
    message: "Product added to cart",
  });
});

// @desc    Get logged user cart
// @route   GET /api/v1/cart
// @access  Private/Protected/User
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new APIError("Cart not found", 404));
  }
  res.status(200).json({ numOfCartItems: cart.items.length, data: cart });
});

// @desc    Remove product from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private/Protected/User
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { items: { _id: req.params.itemId } },
    },
    {
      new: true,
    }
  );
  if (!cart) {
    return next(
      new APIError("There's no cart for this user, add a product", 404)
    );
  }

  const totalPrice = calculateCartTotalPrice(cart);
  cart.totalPrice = totalPrice;
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.items.length,
    data: cart,
    message: "Product removed from cart",
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private/Protected/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update product quantity in cart
// @route   PUT /api/v1/cart/:itemId
// @access  Private/Protected/User
exports.updateCart = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new APIError("Cart not found", 404));
  }
  const cartItemIndex = cart.items.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (cartItemIndex > -1) {
    const cartItem = cart.items[cartItemIndex];
    cartItem.quantity = quantity;
    cart.items[cartItemIndex] = cartItem;
  } else {
    return next(new APIError("Item not found in cart", 404));
  }
  const totalPrice = calculateCartTotalPrice(cart);
  cart.totalPrice = totalPrice;

  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.items.length,
    data: cart,
    message: "Cart items updated",
  });
});

// @desc    Apply coupon to cart
// @route   POST /api/v1/cart/apply-coupon
// @access  Private/Protected/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // get a coupon from request body based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expiresAt: { $gte: Date.now() }, // check if coupon is not expired
  });
  if (!coupon) {
    return next(new APIError("Coupon is expired or has an invalid name", 404));
  }
  // get cart for user
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new APIError("Cart not found", 404));
  }
  // calculate total price
  const totalPrice = calculateCartTotalPrice(cart);

  // calculate price after discount
  const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2); 
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.items.length,
    data: cart,
    message: "Coupon applied successfully",
  });
});
