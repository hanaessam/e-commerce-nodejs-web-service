const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Alias is required"),
  check("details")
    .notEmpty()
    .withMessage("Details are required"),
  check("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone(["ar-EG"])
    .withMessage("Invalid phone number, must be Egyptian number"),
  check("city")
    .notEmpty()
    .withMessage("City is required"),
  check("postalCode")
    .notEmpty()
    .withMessage("Postal code is required")
    .isPostalCode("EG")
    .withMessage("Invalid postal code, must be Egyptian postal code"),
  validatorMiddleware,
];

exports.removeAddressValidator = [
  check("addressId")
    .isMongoId()
    .withMessage("Invalid address ID format"),
  validatorMiddleware,
];