const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  rating: { type: Number, default: 0 },
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("RATING_FEEDBACK", requestSchema);