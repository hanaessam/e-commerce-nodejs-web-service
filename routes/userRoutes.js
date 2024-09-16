const express = require("express");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  changeUserPassword,
  updateMyPassword,
  getMe,
  updateMe,
  deactivateMe,
  activateUser
} = require("../controllers/userController");

const authService = require("../services/authService");

const router = express.Router();

// User access
router.use(authService.protect);
router.get("/me", getMe, getUser);
router.put("/me", updateLoggedUserValidator, updateMe);
router.put(
  "/me/change-password",
  changeUserPasswordValidator,
  updateMyPassword
);
router.delete("/me", deactivateMe);

// Admin access only
router.use(authService.protect, authService.allowedTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put(
  "/change-password/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router.put("/activate/:id",  activateUser);

module.exports = router;
