const jwt = require('jsonwebtoken');
const { constants } = require('../config/constants.js');

const generateTokens = (userId, userType) => {
  const payload = { _id: userId, type: userType };
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Haversine formula for km
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const isInTimeSlot = (currentTime, slotFrom, slotTo) => {
  // Compare times (assume HH:MM format)
  const now = new Date(`2000-01-01T${currentTime}`);
  const from = new Date(`2000-01-01T${slotFrom}`);
  const to = new Date(`2000-01-01T${slotTo}`);
  return now >= from && now <= to;
};

const getRatingPriority = (rating) => {
  if (rating === 5) return 1;
  if (rating === 4) return 2;
  return 3; // Lower or 0
};

module.exports = {
  generateTokens,
  verifyToken,
  calculateDistance,
  isInTimeSlot,
  getRatingPriority
};