const Joi = require("joi");

const saveAffirmation = Joi.object({
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  description: Joi.string().trim().required(),
  time: Joi.array().items(
    Joi.object({
      index: Joi.string().trim().required(),
      time: Joi.string().trim().required(),
    })
  ).optional(),
}).unknown(true);

module.exports = { saveAffirmation };