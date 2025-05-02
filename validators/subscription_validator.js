const Joi = require("joi");

const saveSubscription = Joi.object({
  duration: Joi.string().trim().required(),
  amount: Joi.number().min(0).required(),
  description: Joi.string().trim().required(),
  features: Joi.object().required(),
});

module.exports = {saveSubscription};