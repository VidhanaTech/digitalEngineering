const Joi = require('joi');

const user = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNum: Joi.string().required(),
  }),
};

module.exports = {
  user
};
