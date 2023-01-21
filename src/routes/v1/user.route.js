const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post( validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/hobby')
  .post(validate(userValidation.createHobby), userController.createHobby)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
