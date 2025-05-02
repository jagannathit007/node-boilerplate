const mongoose = require("mongoose");

const bugReportsSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      description: String,
      images: [String],
      deviceInfo: String,
      status: { type: String, enum: ['pending', 'in-progress', 'checking', 'complete'], default: 'pending' },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("BugReports", bugReportsSchema);
  