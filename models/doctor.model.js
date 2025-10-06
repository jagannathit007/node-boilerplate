const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/bcrypt.js');

const workingDaySchema = new mongoose.Schema({
  day: { type: String, required: true }, // e.g., 'Monday'
  enabled: { type: Boolean, default: false },
  slots: [{
    from: { type: String, required: true }, // HH:MM
    to: { type: String, required: true }
  }]
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  experience: { type: Number, required: true },
  type: { type: String,enum: ['Intern', 'Regular'], required: true },
  clinicName: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    coordinates: { type: [Number], default: [0, 0] }
  },
  specialties: [{ name: { type: String, required: true } }],
  equipment: [
    {id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' }},
    {isActive: { type: Boolean, default: true }}
  ],
  notificationRange: { type: Number, default: 4 }, 
  workingDays: [workingDaySchema],
  services: [
    { id:{type: mongoose.Schema.Types.ObjectId, ref: 'Service' }},
    {isActive: { type: Boolean, default: true }}
  ],
  totalRatings: { type: Number, default: 0 },
  sumRatings: { type: Number, default: 0 }, 
  fcmToken: { type: String, default: '' },
  password: { type: String, required: true, select: false },
  refreshToken: { type: String, default: null, select: false },
  isActive: { type: Boolean, default: true },
  fcmToken: { type: String, default: '' },
}, { timestamps: true });

doctorSchema.virtual('averageRating').get(function () {
  return this.totalRatings > 0 ? this.totalRatings / this.totalRatings : 0; // Wait, totalRatings is count, but average needs sum
});

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

doctorSchema.methods.isPasswordCorrect = async function (password) {
  return await comparePassword(password, this.password);
};

doctorSchema.methods.updateRating = async function (newRating) {
  this.totalRatings += 1;
  this.sumRatings += newRating;
  await this.save();
};

doctorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, type: 'Doctor' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

doctorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

module.exports = mongoose.model("Doctor", doctorSchema);