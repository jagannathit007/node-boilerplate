const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      pin: String,
      isMorningReflection: { type: Boolean, default: false },
      isEveningReflection: { type: Boolean, default: false },
      isAffirmations: { type: Boolean, default: false },
      isProtectWithPin: { type: Boolean, default: false },
      isProtectWithBiometrics: { type: Boolean, default: false },
      lastResetPinAt: Date,
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Settings", settingsSchema);