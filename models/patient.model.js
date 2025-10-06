const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/bcrypt.js');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: {
    address: { type: String, required: true },
    coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
  },
  password: { type: String, required: true, select: false },
  fcmToken: { type: String, default: '' },
  refreshToken: { type: String, default: null, select: false }
}, { timestamps: true });


patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

patientSchema.methods.isPasswordCorrect = async function (password) {
  return await comparePassword(password, this.password);
};

patientSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, type: 'Patient' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

patientSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

module.exports = mongoose.model("Patient", patientSchema);