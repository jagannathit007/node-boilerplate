const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    name: String,
    emailId: String,
    password: String,
    socialId: String,
    signupType: { type: String, enum: ['Google', 'Apple', 'Regular'], default: 'Regular' },
    topics: [String],
    profileImage: String,
    isIntroPassed: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    lastOtp: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", usersSchema);
