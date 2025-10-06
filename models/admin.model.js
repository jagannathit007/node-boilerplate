const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/bcrypt.js');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar: { type: String, default: '' },
  refreshToken: { type: String, default: null, select: false }
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await comparePassword(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, type: 'Admin' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

module.exports = mongoose.model("Admin", adminSchema);