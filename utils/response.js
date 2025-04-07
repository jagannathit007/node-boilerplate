const codes = {
  success: 200,
  resourceNotAvailable: 404,
  forbidden: 403,
  unAuthrorized: 401,
  internalServerError: 500,
};

exports.success = (message, data, response) => {
  return response.status(codes.success).json({
    message: message || "Executed successfully!",
    data: data,
    status: codes.success,
  });
};

exports.notFound = (response) => {
  return response.status(codes.resourceNotAvailable).json({
    message: "Resource not found!",
    data: null,
    status: codes.resourceNotAvailable,
  });
};

exports.forbidden = (message, response) => {
  return response.status(codes.forbidden).json({
    message: message || "Access forbidden!",
    data: null,
    status: codes.forbidden,
  });
};

exports.unauthorized = (response) => {
  return response.status(codes.unAuthrorized).json({
    message: "Unauthorized access!",
    data: null,
    status: codes.unAuthrorized,
  });
};

exports.serverError = (error, response) => {
  return response.status(codes.internalServerError).json({
    message: error.message || "Internal server error!",
    data: null,
    status: codes.internalServerError,
  });
};
