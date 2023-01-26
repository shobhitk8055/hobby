const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const hobbyController = require("../../controllers/hobby.controller");

const router = express.Router();

router
  .route("/hobby")
  .post(validate(userValidation.createHobby), hobbyController.createHobby)
  .delete(validate(userValidation.createHobby), hobbyController.createHobby);

router
  .route("/track")
  .post(validate(userValidation.changeStatus), hobbyController.changeStatus)

module.exports = router;
