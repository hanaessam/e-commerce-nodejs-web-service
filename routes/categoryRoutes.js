const express = require("express");

const router = express.Router();
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const subCategoryRouter = require("./subCategoryRoutes");

router
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidator, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);
  
  router.use("/:categoryId/sub-categories", subCategoryRouter);


module.exports = router;
