const asyncHandler = require('express-async-handler');
const { response } = require('../../utils/response.js');
const { models } = require('../../models/zindex.js');

const createService = asyncHandler(async (req, res) => {
    const { name, charge } = req.body;
    const service = await models.Service.create({ name, charge });
    return response.create("Service created", service, res);
  });
  
  const updateService = asyncHandler(async (req, res) => {
    const { name, charge, isActive,id}=req.body;
    const service = await models.Service.findByIdAndUpdate(id, { name, charge, isActive }, { new: true });
    if (!service) return response.notFound("Service not found", res);
    return response.success("Service updated", service, res);
  });
  
  // getServices: Include charge/isActive
  const getServices = asyncHandler(async (req, res) => {
    const services = await models.Service.find({ isActive: true }).select('name charge');
    return response.success("Services fetched", services, res);
  });
  
  const deleteService = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const service = await models.Service.findByIdAndDelete(id);
    if (!service) return response.notFound("Service not found", res);
    return response.success("Service deleted", service, res);
  });
  // Similar for Equipment (add charge/isActive CRUD)
  
  module.exports = {
    createService,
    updateService,
    deleteService,
    getServices,
    // Add createEquipment, etc.
  };