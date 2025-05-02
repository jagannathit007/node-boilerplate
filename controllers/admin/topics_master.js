const mongoose = require("mongoose");
const models = require("./../../models/zindex");
const response = require("./../../utils/response");
const validator = require("./../../validators/topicValidator");
const asyncHandler = require("express-async-handler");


exports.saveTopic = asyncHandler(async (req, res) => {
  try {
    const { error, value } = validator.saveTopic.validate(req.body);
    if (error) return response.success(error.message, null, res);

    const { id, title, image, colorCode, background, isActive } = value;

    if (!id) {
      const newTopic = await models.topics_master.create({
        title,
        image,
        colorCode,
        background,
        isActive,
      });
      return response.success("Topic added successfully.", newTopic, res);
    }

    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid topic ID.", null, res);
    }

    const updated = await models.topics_master.findByIdAndUpdate(
      id,
      { title, image, colorCode, background, isActive },
      { new: true }
    );

    if (!updated) return response.notFound(res);

    return response.success("Topic updated successfully.", updated, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});


exports.deleteTopic = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return response.success("Invalid topic ID.", null, res);
    }

    const deleted = await models.topics_master.findByIdAndDelete(id);
    if (!deleted) return response.notFound(res);

    return response.success("Topic deleted successfully.", deleted, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});


exports.getTopicList = asyncHandler(async (req, res) => {
  try {
    const list = await models.topics_master.find().sort({ createdAt: -1 });
    return response.success("Fetched topic list successfully.", list, res);
  } catch (err) {
    return response.serverError(err, res);
  }
});
