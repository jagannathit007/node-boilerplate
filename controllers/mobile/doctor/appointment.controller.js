const asyncHandler = require('express-async-handler');
const { models } = require('../../../models/zindex.js');
const { response } = require('../../../utils/response.js');
const { sendNotification } = require('../../../utils/notifications.js');

const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await models.Request.find({ doctor: req.user._id }).populate('patient service therapy');
    // Add averageRating to each? Or per doctor
    return response.success("Appointments fetched", appointments, res);
  });
  
  const acceptRequest = asyncHandler(async (req, res) => {
    // ... (unchanged)
    // After accept, sendNotification to patient
    sendNotification(request.patient._id, 'Request Accepted', `Doctor ${req.user.name} accepted your request.`);
  });
  
  // cancelRequest: Send notification to patient with message
  const cancelRequest = asyncHandler(async (req, res) => {
    // ... (unchanged)
    sendNotification(request.patient._id, 'Request Cancelled', 'The doctor cancelled the request. You can request again.');
  });
  
  // Add completeAppointment (set to Completed, enable feedback)
  const completeAppointment = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const request = await models.Request.findById(requestId);
    if (request.doctor.toString() !== req.user._id.toString() || request.status !== 'Accepted') {
      return response.forbidden("Cannot complete", res);
    }
    request.status = 'Completed';
    await request.save();
    sendNotification(request.patient._id, 'Appointment Completed', 'Please provide feedback.');
    return response.success("Appointment completed", request, res);
  });
  
  module.exports = {
    getAppointments,
    acceptRequest,
    cancelRequest,
    completeAppointment
  };