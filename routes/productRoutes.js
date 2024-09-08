const express = require('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require('../utils/validators/productValidator');

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProdcutImages,
  resizeProductImages,
} = require('../controllers/productController');

const router = express.Router();

router.route('/').get(getProducts).post(
  uploadProdcutImages,
  resizeProductImages,
  createProductValidator, createProduct);
router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(  uploadProdcutImages,
    resizeProductImages,updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
