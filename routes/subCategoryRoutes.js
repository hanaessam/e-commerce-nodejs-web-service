const express = require("express");

// mergeParams: allows access to the parent route params
const router = express.Router(
  { mergeParams: true }
);
const {
  getAllSubCategories,
  createSubCategory,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToParent,
  getAllSubCategoriesByCategoryFilter
} = require("../controllers/subCategoryController");
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

router
  .route("/")
  .get(getAllSubCategoriesByCategoryFilter,getAllSubCategories)
  .post(setCategoryIdToParent,createSubCategoryValidator, createSubCategory);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
