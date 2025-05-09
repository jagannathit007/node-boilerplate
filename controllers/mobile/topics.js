const models = require("../../models/zindex");
const response = require("../../utils/response");
const asyncHandler = require("express-async-handler");

exports.getTopics = asyncHandler(async(req, res)=>{
    let topics = await models.topics_master.find({ isActive: true }).select('-updatedAt -createdAt -__v').lean();
    return response.success("Topics fetched succesfully!", topics, res);
})