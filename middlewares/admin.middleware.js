const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { response } = require('../utils/response.js');
const { models } = require('../models/zindex.js');

const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || 
      req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return response.unauthorized("unauthorized access", res);
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await models.Admin.findById(decodedToken._id).select("-password -refreshToken").lean();
 
    if (!user) {
      return response.unauthorized("unauthorized access", res);
    }
    req.admin = user;
    req.userType = 'Admin';
    next();
  } catch (error) {
    return response.unauthorized("unauthorized access", res);
  }
});

module.exports = { adminAuthMiddleware };