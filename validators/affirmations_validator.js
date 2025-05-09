const Joi = require("joi");

const saveAffirmation = Joi.object({
  description: Joi.string().trim().required(),
  time: Joi.array().items(
    Joi.object({
      index: Joi.string().trim().required(),
      time: Joi.string().trim().required(),
    })
  ).optional(),
}).unknown(true);

module.exports = { saveAffirmation };