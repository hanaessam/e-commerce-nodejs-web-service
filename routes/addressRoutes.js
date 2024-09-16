const express = require("express");
const authService = require("../services/authService");
const {
  addToAddresses,
  removeFromAddresses,
  getAddresses,
} = require("../controllers/addressController");
const {
  addAddressValidator,
  removeAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/")
  .post(addAddressValidator, addToAddresses)
  .get(getAddresses);

router.route("/:addressId")
  .delete(removeAddressValidator, removeFromAddresses);

module.exports = router;