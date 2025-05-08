const Joi = require("joi");

const saveUser = Joi.object({
  name: Joi.string().trim().required(),
  emailId: Joi.string().email().trim().required(),
  password: Joi.string().min(6).required(), // You can adjust password validation rules
  googleId: Joi.string().trim().optional().allow(""),
  signupType: Joi.string().valid('Google', 'Apple', 'Regular').default('Regular'),
  topics: Joi.array().items(Joi.string().trim()).optional(),
  profileImage: Joi.string().uri().optional().allow(""),
  isIntroPassed: Joi.boolean().optional(),
  isVerified: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  isBlocked: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional(),
  lastOtp: Joi.string().trim().optional().allow(""),
}).unknown(true); // Allows extra fields

module.exports = { saveUser };
