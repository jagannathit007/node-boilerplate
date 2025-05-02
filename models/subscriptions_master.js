const mongoose = require("mongoose");

const subscriptionsMasterSchema = new mongoose.Schema(
    {
      duration: String,
      amount: Number,
      description: String,
      features: Object,
      isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("SubscriptionsMaster", subscriptionsMasterSchema);
  