const mongoose = require("mongoose");

const userSubscriptionsSchema = new mongoose.Schema(
    {
      subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionsMaster" },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      joinedAt: Date,
      status: { type: String, enum: ['trial', 'subscription-started', 'subscription-ended', 'hold', 'cancelled'], default: 'trial' },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("UserSubscriptions", userSubscriptionsSchema);
  