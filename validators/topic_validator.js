const Joi = require("joi");

const saveTopic = Joi.object({
  title: Joi.string().trim().required(),
  colorCode: Joi.string().trim().optional().allow(""),
}).unknown(true);

module.exports = {saveTopic};
