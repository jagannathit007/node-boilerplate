const asyncHandler = require('express-async-handler');
const { models } = require('../../../models/zindex.js');
const { response } = require('../../../utils/response.js');
const { getRatingPriority } = require('../../../utils/helpers.js'); // Removed calculateDistance as using aggregate
const io = require('../../../server.js');
const { sendNotification } = require('../../../utils/notifications.js');

const createRequest = asyncHandler(async (req, res) => {
  const { service,equipment} = req.body;
  const patient = req.user;
  const request = await models.Request.create({
    patient: patient._id,
    service,
    equipment,
  });

  // Match doctors: geo from patient.location, match specialties/services, working time, priority by averageRating
  const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

  const doctors = await models.Doctor.aggregate([
    {
      $geoNear: {
        near: {coordinates: patient.location.coordinates },
        distanceField: 'dist',
        maxDistance: (patient.notificationRange || 4) * 1000, // Use patient's range or default
        spherical: true
      }
    },
    { $match: {
      specialties: { $in: [service] }, // Match on service (assume specialties include services)
      'workingDays': { $elemMatch: { day: currentDay, enabled: true, slots: { $elemMatch: { from: { $lte: currentTime }, to: { $gte: currentTime } } } } },
      isActive: true
    }},
    { $lookup: { from: 'rating_feedback', localField: '_id', foreignField: 'doctor', as: 'feedbacks' } },
    { $addFields: {
      averageRating: { $cond: [{ $gt: [{ $size: '$feedbacks' }, 0] }, { $divide: [{ $sum: '$feedbacks.rating' }, { $size: '$feedbacks' }] }, 0] },
      priority: { $switch: { branches: [{ case: { $eq: [{ $round: ['$averageRating'] }, 5] }, then: 1 }, { case: { $eq: [{ $round: ['$averageRating'] }, 4] }, then: 2 }], default: 3 } }
    }},
    { $sort: { priority: 1, dist: 1 } },
    { $project: { feedbacks: 0 } }
  ]);

  // Notify 5-star first, cascade to lower after 1 min (use setTimeout)
  const highPriority = doctors.filter(d => Math.round(d.averageRating) === 5);
  const lowPriority = doctors.filter(d => Math.round(d.averageRating) < 5);

  highPriority.forEach(doctor => {
    io.to(`doctor_${doctor._id}`).emit('newRequest', { requestId: request._id, patientDetails: patient });
    sendNotification(doctor._id, 'New Request', `Service: ${service.name}`, { requestId: request._id.toString() });
  });

  setTimeout(() => {
    if (request.status === 'Pending') { // Still pending
      lowPriority.forEach(doctor => {
        io.to(`doctor_${doctor._id}`).emit('newRequest', { requestId: request._id, patientDetails: patient });
        sendNotification(doctor._id, 'New Request (Cascade)', `Service: ${service.name}`, { requestId: request._id.toString() });
      });
    }
  }, 60000); // 1 min

  return response.create("Request created, notifying doctors", await request.populate('service therapy'), res);
});

const cancelRequest = asyncHandler(async (req, res) => {
  // ... (unchanged, but check 5 min window on acceptedAt)
});

// Add getRequests for patient
const getPatientRequests = asyncHandler(async (req, res) => {
  const requests = await models.Request.find({ patient: req.user._id }).populate('service therapy doctor');
  return response.success("Requests fetched", requests, res);
});

module.exports = {
  createRequest,
  cancelRequest,
  getPatientRequests
};