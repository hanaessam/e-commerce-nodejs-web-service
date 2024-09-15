const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeCategoryImage,
} = require("../controllers/categoryController");
const subcategoriesRoute = require("./subCategoryRoutes");
const AuthService = require("../services/authService");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(AuthService.protect,
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
