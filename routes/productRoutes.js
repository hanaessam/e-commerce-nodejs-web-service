const express = require("express");

const router = express.Router();
const {
  getProduct,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");


router
  .route("/")
  .get(getAllProducts)
  .post(createProductValidator, createProduct);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);
  



module.exports = router;
