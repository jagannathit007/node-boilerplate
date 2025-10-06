const asyncHandler = require('express-async-handler');
const { models } = require('../../models/zindex.js');
const { response } = require('../../utils/response.js');
const { generateTokens } = require('../../../utils/helpers.js');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.js');
const path = require('path');

const generateTokens = async (patientId, res) => {
  const { accessToken } = generateTokens(patientId, 'Patient');
  const patient = await models.Patient.findById(patientId);
  patient.refreshToken = refreshToken;
  await patient.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { name, password, mobile, address, email, location, fcmToken } = req.body;
  const existed = await models.Patient.findOne({ $or: [{ mobile }, { email }] }).lean();
  if (existed) return response.conflict("Patient with mobile or email already exists", res);

  const user = await models.Patient.create({ 
    name, 
    password, 
    mobile, 
    address, 
    email, 
    location: { address: address, coordinates: coordinates }, // Ensure GeoJSON
    fcmToken // For notifications
  });
  const createdUser = await models.Patient.findById(user._id).select("-password -refreshToken").lean();
  return response.create("Patient registered successfully", createdUser, res);
});

const login = asyncHandler(async (req, res) => {
  const { mobile, password, fcmToken } = req.body; 
  const user = await models.Patient.findOne({ mobile });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return response.unauthorized("Invalid credentials", res);
  }
  if (fcmToken) user.fcmToken = fcmToken; // Update token
  await user.save();
  const { accessToken } = await generateTokensForPatient(user._id, res);
  const loggedUser = await models.Patient.findById(user._id).select("-password -refreshToken");
  return response.success("Patient login successful", { Patient: loggedUser, accessToken }, res);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await models.Patient.findById(req.user._id);
  if (!user || !(await user.isPasswordCorrect(currentPassword))) {
    return response.requiredField("Invalid current password", res);
  }
  user.password = await hashPassword(newPassword);
  await user.save({ validateBeforeSave: false });
  return response.success("Password changed successfully", true, res);
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, mobile, address, email, location, fcmToken } = req.body;
  let updateFields = { name, mobile, address, email, fcmToken };
  if (location) updateFields.location = { type: 'Point', coordinates: location };
  const patient = await models.Patient.findByIdAndUpdate(req.user._id, updateFields, { new: true })
    .select("-password -refreshToken");
  return response.success("Profile updated", patient, res);
});

module.exports = {
  register,
  login,
  changePassword,
  updateProfile
};