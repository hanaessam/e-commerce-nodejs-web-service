const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProdcutImages,
  resizeProductImages,
} = require("../controllers/productController");
const authService = require("../services/authService");
const reviewRoute = require("./reviewRoutes");

const router = express.Router();

router.use("/:productId/reviews", reviewRoute);


router
  .route("/")
  .get(getProducts)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProdcutImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProdcutImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(authService.protect,
    authService.allowedTo("admin"),deleteProductValidator, deleteProduct);

module.exports = router;
