const express = require("express");

const {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  getUserValidator,
  changeUserPasswordValidator,
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
} = require("../controllers/userController");


const router = express.Router();

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator,createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage,updateUserValidator ,updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put("/change-password/:id",changeUserPasswordValidator ,changeUserPassword);

module.exports = router;
