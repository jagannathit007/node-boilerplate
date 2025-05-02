const mongoose = require("mongoose");
const models = require("../../models/zindex");
const response = require("../../utils/response");
const validator = require("../../validators/subscription_validator"); // assume you have this
const asyncHandler = require("express-async-handler");


exports.saveSubscription = asyncHandler(async (req, res) => {
  try {
    const { error, value } = validator.saveSubscription.validate(req.body);
    if (error) return response.success(error.message, null, res);

    const { id, duration, amount, description, features } = value;

    if (!id) {
      const newSub = await models.subscriptions_master.create({
        duration,
        amount,
        description,
        features,
      });
      return response.success("Subscription added successfully.", newSub, res);
    }

    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid subscription ID.", null, res);
    }

    const updated = await models.subscriptions_master.findByIdAndUpdate(
      id,
      { duration, amount, description, features },
      { new: true }
    );

    if (!updated) return response.notFound(res);

    return response.success("Subscription updated successfully.", updated, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});


exports.deleteSubscription = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid subscription ID.", null, res);
    }

    const deleted = await models.subscriptions_master.findByIdAndDelete(id);

    if (!deleted) return response.notFound(res);

    return response.success("Subscription deleted successfully.", deleted, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});


exports.getSubscriptionList = asyncHandler(async (req, res) => {
  try {
    let list = await models.subscriptions_master.find();
    return response.success("Fetched subscription list successfully.", list, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});
