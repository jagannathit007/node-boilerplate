const asyncHandler = require('express-async-handler');
const { response } = require('../../utils/response.js');
const { models } = require('../../models/zindex.js');

const createEquipment = asyncHandler(async (req, res) => {
    const { name, charge } = req.body;
    if(!name || !charge){
        return response.requiredField("name and charge are required", res);
    }
    const equipment = await models.Equipment.create({ name, charge });
    return response.create("Equipment created", equipment, res);
  });
  
  const updateEquipment = asyncHandler(async (req, res) => {
    const { name, charge, isActive,id}=req.body;
    const equipment = await models.Equipment.findByIdAndUpdate(id, { name, charge, isActive }, { new: true });
    if (!equipment) return response.notFound("Equipment not found", res);
    return response.success("Equipment updated", equipment, res);
  });
  
  const deleteEquipment = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if(!id){
        return response.requiredField("id is required", res);
    }
    
    const equipment = await models.Equipment.findByIdAndDelete(id);
    if (!equipment) return response.notFound("Equipment not found", res);
    return response.success("Equipment deleted", equipment, res);
  });

  const getEquipments = asyncHandler(async (req, res) => {
    const equipments = await models.Equipment.find({ isActive: true }).select('name charge');
    return response.success("Equipments fetched", equipments, res);
  });

  module.exports = {
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipments
  };