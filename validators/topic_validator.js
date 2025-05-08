const Joi = require("joi");

const saveTopic = Joi.object({
  title: Joi.string().trim().required(),
  image: Joi.string().uri().optional().allow(""),
  colorCode: Joi.string().trim().optional().allow(""),
  background: Joi.string().trim().optional().allow(""),
  isActive: Joi.boolean().optional(),
}).unknown(true);

module.exports = {saveTopic};
