const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
      name: String,
      emailId: String,
      password: String,
      lastLoginAt: Date,
      lastPasswordResetAt: Date,
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Admin", adminSchema);
  