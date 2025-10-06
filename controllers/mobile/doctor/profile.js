const asyncHandler = require('express-async-handler');
const { models } = require('../../../models/zindex.js');
const { response } = require('../../../utils/response.js');

const updateProfile = asyncHandler(async (req, res) => {
    const { name, email, mobile, experience, type, clinicName, notificationRange, workingDays } = req.body; // Added fields
    const doctor = await models.Doctor.findByIdAndUpdate(req.user._id, {
      name, email, mobile, experience, type, clinicName, notificationRange, workingDays
    }, { new: true }).populate('specialties equipment doctorType');
    return response.success("Profile updated", doctor, res);
  });
  
  // toggleService unchanged
  
  // Add toggleEquipment similar
  const toggleEquipment = asyncHandler(async (req, res) => {
    const { equipmentId, active } = req.body;
    const doctor = await models.Doctor.findById(req.user._id);
    if (active) {
      if (!doctor.equipment.includes(equipmentId)) doctor.equipment.push(equipmentId);
    } else {
      doctor.equipment = doctor.equipment.filter(id => id.toString() !== equipmentId);
    }
    await doctor.save();
    return response.success("Equipment toggled", doctor, res);
  });
  
  // Add getProfile with averageRating
  const getProfile = asyncHandler(async (req, res) => {
    const doctor = await models.Doctor.findById(req.user._id).populate('specialties equipment doctorType');
    const feedbacks = await models.RATING_FEEDBACK.find({ doctor: req.user._id });
    const averageRating = feedbacks.length > 0 ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length : 0;
    return response.success("Profile fetched", { ...doctor.toObject(), averageRating }, res);
  });
  
  module.exports = {
    updateProfile,
    setNotificationRange: (req, res) => { /* Use updateProfile */ },
    updateWorkingDays: (req, res) => { /* Use updateProfile */ },
    toggleService,
    toggleEquipment,
    getProfile
  };