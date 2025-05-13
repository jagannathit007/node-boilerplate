const mongoose = require("mongoose");
const models = require("../../models/zindex");
const response = require("../../utils/response");
const validator = require("../../validators/affirmations_validator");
const asyncHandler = require("express-async-handler");

exports.saveAffirmation = asyncHandler(async (req, res) => {
  try {
    const { error, value } = validator.saveAffirmation.validate(req.body);
    if (error) return response.success(error.message, null, res);

    const { id, description, time } = value;

    if (!id) {
      delete value.id;
      value.userId = req.token.id;
      const newAffirmation = await models.affirmations.create(value);
      return response.success("Affirmation added successfully.", newAffirmation, res);
    }

    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid affirmation ID.", null, res);
    }

    const updated = await models.affirmations.findByIdAndUpdate(id, { description, time }, { new: true }).select("-__v");
    return response.success("Affirmation updated successfully.", updated, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});

exports.deleteAffirmation = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid affirmation ID.", null, res);
    }
    const deleted = await models.affirmations.findByIdAndDelete(id);
    return response.success("Affirmation deleted successfully.", deleted, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});

exports.getAffirmations = asyncHandler(async (req, res) => {
  try {
    const { search } = req.body;
    const userId = req.token.id;
    let searchRegex = new RegExp(search, "i");
    const list = await models.affirmations.find({ userId, $or: [{ description: searchRegex }] }).select("-__v");
    return response.success("Fetched affirmations successfully.", list, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});
