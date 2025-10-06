const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Null until accepted
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Cancelled', 'Completed'], default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
  acceptedAt: { type: Date },
  cancelledBy: { type: String, enum: ['Patient', 'Doctor'] },
  rating: { type: Number, default: 0 }, // Post-service
  feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);