const express = require("express");
const authService = require("../services/authService");
const {
  addToAddresses,
  removeFromAddresses,
  getAddresses,
} = require("../controllers/addressController");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addToAddresses).get(getAddresses);
router.route("/:addressId").delete(removeFromAddresses);

module.exports = router;
