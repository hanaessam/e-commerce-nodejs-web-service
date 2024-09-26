// Routes
const categoryRoute = require("./categoryRoutes");
const subCategoryRoute = require("./subCategoryRoutes");
const brandRoute = require("./brandRoutes");
const productRoute = require("./productRoutes");
const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");
const reviewRoute = require("./reviewRoutes");
const wishlistRoute = require("./wishlistRoutes");
const addressesRoute = require("./addressRoutes");
const couponsRoute = require("./couponRoutes");
const cartRoute = require("./cartRoutes");
const orderRoute = require("./orderRoutes");

const mountRoutes = (app) => {
  // Mount Routes
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/sub-categories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishlistRoute);
  app.use("/api/v1/addresses", addressesRoute);
  app.use("/api/v1/coupons", couponsRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);

  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
};

module.exports = mountRoutes;
