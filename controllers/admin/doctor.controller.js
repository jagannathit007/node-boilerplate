const asyncHandler = require('express-async-handler');
const { response } = require('../../utils/response.js');
const { models } = require('../../models/zindex.js');

const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await models.Doctor.aggregate([
      { $lookup: { from: 'rating_feedback', localField: '_id', foreignField: 'doctor', as: 'feedbacks' } },
      { $addFields: {
        averageRating: { $divide: [{ $sum: '$feedbacks.rating' }, { $size: '$feedbacks' }] } // Calculate average
      }},
      { $project: { feedbacks: 0 } }, // Hide feedbacks
      { $lookup: { from: 'specialties', localField: 'specialties', foreignField: '_id', as: 'specialties' } },
      { $lookup: { from: 'equipment', localField: 'equipment', foreignField: '_id', as: 'equipment' } },
      { $lookup: { from: 'doctortypes', localField: 'doctorType', foreignField: '_id', as: 'doctorType' } }
    ]);
    return response.success("Doctors fetched", doctors, res);
  });
  
  // createDoctor: Include experience, type in body
  const createDoctor = asyncHandler(async (req, res) => {
    const { name, email, mobile, experience, type, clinicName, location, specialties, equipment, doctorType } = req.body;
    const doctor = await models.Doctor.create({ name, email, mobile, experience, type, clinicName, location, specialties, equipment, doctorType });
    return response.create("Doctor created", doctor, res);
  });
  
  // updateDoctor similar, include fields
  
  // For patients CRUD, add email
  const createPatient = asyncHandler(async (req, res) => {
    const { name, mobile, address, email, location } = req.body;
    const patient = await models.Patient.create({ name, mobile, address, email, location, password: 'temp' }); // Password handled separately?
    return response.create("Patient created", patient, res);
  });