const asyncHandler = require('express-async-handler');
const { models } = require('../../../models/zindex.js');
const { response } = require('../../../utils/response.js');

const submitFeedback = asyncHandler(async (req, res) => {
  const { requestId, rating, feedback } = req.body;
  const request = await models.Request.findById(requestId).populate('doctor');
  if (request.patient.toString() !== req.user._id.toString() || request.status !== 'Completed') {
    return response.forbidden("Invalid feedback", res);
  }

  // Create in RATING_FEEDBACK
  await models.RATING_FEEDBACK.create({
    patient: req.user._id,
    doctor: request.doctor._id,
    rating,
    feedback
  });

  // Update doctor ratings
  const doctor = await models.Doctor.findById(request.doctor._id);
  doctor.totalRatings += 1;
  doctor.sumRatings += rating;
  await doctor.save();

  // Mark request as completed if not
  request.status = 'Completed';
  await request.save();

  return response.success("Feedback submitted", { rating, feedback }, res);
});

module.exports = {
  submitFeedback
};