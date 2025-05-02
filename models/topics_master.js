const mongoose = require("mongoose");

const topicsMasterSchema = new mongoose.Schema(
    {
      title: String,
      image: String,
      colorCode: String,
      background: String,
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("TopicsMaster", topicsMasterSchema);
  