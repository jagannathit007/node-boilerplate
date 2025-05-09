const mongoose = require("mongoose");
const models = require("./../../models/zindex");
const response = require("./../../utils/response");
const validator = require("./../../validators/topic_validator");
const asyncHandler = require("express-async-handler");

exports.saveTopic = asyncHandler(async (req, res) => {  
  try {
    const { error, value } = validator.saveTopic.validate(req.body);
    if (error) return response.success(error.message, null, res);

    const { _id, title, colorCode, isActive } = value;

    if (_id == null || _id == "") {
      let obj = { title: title, colorCode: colorCode, isActive: true, };
      if(req.file){
        obj.image = req.file.path;
      }
      const newTopic = await models.topics_master.create(obj);
      return response.success("Topic added successfully.", newTopic, res);
    }

    if (!mongoose.isValidObjectId(_id)) {
      return response.success("Invalid topic ID.", null, res);
    }

    let obj = { title, colorCode, isActive };
    if (req.file) { obj.image = req.file.path; }

    const updated = await models.topics_master.findByIdAndUpdate(_id, obj, {
      new: true,
    });
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

    await models.topics_master.findByIdAndDelete(id);
    return response.success("Topic deleted successfully.", true, res);
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
