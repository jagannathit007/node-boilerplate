const mongoose = require("mongoose");
const models = require("../../models/zindex"); // Assuming Affirmations model is exported here
const response = require("../../utils/response");
const validator = require("../../validators/affirmations_validator"); // assume you have this
const asyncHandler = require("express-async-handler");

// Add or Update Affirmation
exports.saveAffirmation = asyncHandler(async (req, res) => {
  try {
    const { error, value } = validator.saveAffirmation.validate(req.body);
    if (error) return response.success(error.message, null, res);

    const { id, userId, description, time } = value;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return response.success("Invalid user ID.", null, res);
    }

    if (!id) {
      const newAffirmation = await models.affirmations.create({
        userId,
        description,
        time,
      });
      return response.success("Affirmation added successfully.", newAffirmation, res);
    }

    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid affirmation ID.", null, res);
    }

    const updated = await models.affirmations.findByIdAndUpdate(
      id,
      { description, time },
      { new: true }
    ).select("-__v");

    if (!updated) return response.notFound(res);

    return response.success("Affirmation updated successfully.", updated, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});

// Delete Affirmation
exports.deleteAffirmation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid affirmation ID.", null, res);
    }

    const deleted = await models.affirmations.findByIdAndDelete(id);

    if (!deleted) return response.notFound(res);

    return response.success("Affirmation deleted successfully.", deleted, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});

// Get Affirmations by User (from token)
exports.getAffirmationsByUser = asyncHandler(async (req, res) => {
    try {
      const userId = req.token.id;
  
      if (!userId || !mongoose.isValidObjectId(userId)) {
        return response.success("Invalid user ID.", null, res);
      }
  
      const list = await models.affirmations.find({ userId }).select("-__v");
  
      return response.success("Fetched affirmations successfully.", list, res);
    } catch (err) {
      return response.serverError(err, res);
    }
  });
  
