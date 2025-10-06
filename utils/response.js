const ApiError = require("./apiError.js");

const codes = {
  success: 200,
  resourceNotAvailable: 404,
  forbidden: 403,
  unAuthrorized: 401,   
  noContent: 204,
  internalServerError: 500,
  requiredField: 400,
  conflict: 409,
  created: 201,
  badRequest: 400,
};

const success = (message, data, response) => {
  return response.status(codes.success).json({
    success: true,
    message: message || "Executed successfully!",
    data: data,
    status: codes.success,
  });
};

const badRequest = (data, response) => {
  return response.status(codes.badRequest).json({
    message: "Bad Request!",
    data: data,
    status: codes.badRequest,
  });
};

const create = (message, data, response) => {
  return response.status(codes.created).json({
    success: true,
    message: message || "Created successfully!",
    data: data,
    status: codes.created,
  });
};

const noContent = (message, response) => {
  return response.status(codes.noContent).json({
    message: message || "No Data found",
    data: null,
    status: codes.success,
  });
};

const conflict = (message, response) => {
  const err = new ApiError(codes.conflict, message || "already exist");
  return response.status(err.statusCode).json({
    message: err.message,
    data: err.data,
    status: err.statusCode,
  });
};

const requiredField = (message, response) => {
  const err = new ApiError(codes.requiredField, message || "field are required");
  return response.status(err.statusCode).json({
    message: err.message,
    data: err.data,
    status: err.statusCode,
  });
};

const notFound = (message, response) => {
  const err = new ApiError(codes.resourceNotAvailable, message || "Resource Not Available!");
  return response.status(err.statusCode).json({
    message: err.message,
    data: err.data,
    status: err.statusCode,
  });
};

const forbidden = (message, response) => {
  const err = new ApiError(codes.forbidden, message || "Access forbidden!");
  return response.status(err.statusCode).json({
    message: err.message,
    data: err.data,
    status: err.statusCode,
  });
};

const unauthorized = (message, response) => {
  const err = new ApiError(codes.unAuthrorized, message || "UnAuthorized user!");
  return response.status(err.statusCode).json({
    message: err.message,
    data: err.data,
    status: err.statusCode,
  });
};

const serverError = (err, response) => {
  return response.status(500).json({
    message: err.message,
    data: err.data,
    status: err.statusCode,
  });
};

module.exports = {
  success,
  noContent,
  notFound,
  forbidden,
  unauthorized,
  serverError,
  conflict,
  requiredField,
  create,
  badRequest
};