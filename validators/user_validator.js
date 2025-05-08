const Joi = require("joi");

const saveUser = Joi.object({
  name: Joi.string().trim().required(),
  emailId: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(), // You can adjust password validation rules
  socialId: Joi.string().trim().optional().allow(""),
  signupType: Joi.string().valid('Google', 'Apple', 'Regular').default('Regular'),
  topics: Joi.array().items(Joi.string().trim()).optional(),
}).unknown(true); // Allows extra fields

module.exports = { saveUser };
