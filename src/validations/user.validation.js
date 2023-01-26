const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createHobby = {
  body: Joi.object()
    .keys({
      user: Joi.string(),
      title: Joi.string(),
    })
  };

const changeStatus = {
  params: Joi.object().keys({
    status: Joi.string(),
    hobby: Joi.string().custom(objectId),
    date: Joi.string(),
  }),
};

module.exports = {
  createHobby,
  changeStatus,
};
