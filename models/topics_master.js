const mongoose = require("mongoose");

const topicsMasterSchema = new mongoose.Schema(
    {
      title: {type: String, default: ''},
      image: {type: String, default: ''},
      colorCode: {type: String, default: ''},
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("TopicsMaster", topicsMasterSchema);
  