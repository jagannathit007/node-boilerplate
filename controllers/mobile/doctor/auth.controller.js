const asyncHandler = require('express-async-handler');
const { models } = require('../../models/zindex.js');
const { response } = require('../../utils/response.js');
const { generateTokens } = require('../../utils/helpers.js');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.js');
const path = require('path');

  const generateTokensForDoctor = async (patientId, res) => {
  const { accessToken, refreshToken } = generateTokens(patientId, 'Patient');
  const patient = await models.Patient.findById(patientId);
  patient.refreshToken = refreshToken;
  await patient.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { name,email,mobile, experience, type, clinicName, location, specialties, equipment,notificationRange, workingDays,services,password,fcmToken } = req.body;
  const existed = await models.Doctor.findOne({ $or: [{ mobile }, { email }] }).lean();
  if (existed) return response.conflict("Patient with mobile or email already exists", res);

  const user = await models.Doctor.create({ 
    name, 
    email, 
    mobile, 
    experience, 
    type, 
    clinicName, 
    location, 
    specialties, 
    equipment, 
    notificationRange, 
    workingDays, 
    services, 
    password, 
    fcmToken // For notifications
  });
  user.password = await hashPassword(password);
  await user.save({ validateBeforeSave: false });
  const createdUser = await models.Doctor.findById(user._id).select("-password -refreshToken").lean();
  return response.create("Patient registered successfully", createdUser, res);
});

const login = asyncHandler(async (req, res) => {
  const { mobile, password, fcmToken } = req.body;
  const user = await models.Doctor.findOne({ mobile });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return response.unauthorized("Invalid credentials", res);
  }
  if (fcmToken) user.fcmToken = fcmToken; // Update token
  await user.save();
  const { accessToken, refreshToken } = await generateTokensForDoctor(user._id, res);

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


const updateprofile = asyncHandler(async (req, res) => {
  const { name, mobile, address, email, coordinates, fcmToken,specialties, equipment, notificationRange, workingDays,services } = req.body;
  let updateFields = { name, mobile, address, email, fcmToken,specialties, equipment, notificationRange, workingDays,services };
  if (coordinates) updateFields.location = {address: address, coordinates: coordinates };
  const patient = await models.Patient.findByIdAndUpdate(req.user._id, updateFields, { new: true })
    .select("-password -refreshToken");
  return response.success("Profile updated", patient, res);
});

const getProfile = asyncHandler(async (req, res) => {
  const doctor = await models.Doctor.findById(req.user._id).populate('specialties equipment services');
  return response.success("Profile fetched", doctor, res);
});

module.exports = {
  register,
  login,
  changePassword,
  updateprofile,
};