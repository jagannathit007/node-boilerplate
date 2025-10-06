const asyncHandler = require('express-async-handler');
const { response } = require('../../utils/response.js');
const { models } = require('../../models/zindex.js');
const path = require('path');

exports.register = asyncHandler(async (req, res) => {
    const { email, password, mobile } = req.body; // Removed name
    let image = req?.file?.path; // Fixed path replace
    const existedUser = await models.Admin.findOne({ email }).lean();
  
    if (existedUser) {
      return response.conflict("User with email already Exists", res);
    }
  
    const user = await models.Admin.create({
      avatar: image,
      email,
      password,
      mobile,
    });
  
    const createdUser = await models.Admin.findById(user._id)
      .select("-password -refreshToken")
      .lean();
  
    if (!createdUser) {
      return response.serverError(res);
    }
    return response.create("User Registered Successfully", createdUser, res);
  });

  exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await models.Admin.findOne({ email }).lean();
    if(!user){
      return response.notFound("user not found", res);
    }
  });
  
  exports.updateProfile = asyncHandler(async (req, res) => {
    const {email, mobile} = req.body; 
    const _id = req.admin._id;
    let avatar = req.file?.path;
  
    if (!_id) {
      return response.requiredField("id must required", res);
    }
  
    let updateFields = { email, mobile };
    if (avatar) updateFields.avatar = avatar;
  
    const user = await models.Admin.findByIdAndUpdate(
      _id, 
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");
  
    if (!user) return response.notFound("user not found", res);
  
    return response.success(
      "Admin details updated successfully",
      user,
      res
    );
  });

  exports.getUser = asyncHandler(async (req, res) => {
    const user = await models.Admin.findById(req.admin._id).select("-password -refreshToken");
    return response.success("Admin details fetched successfully", user, res);
  });

  exports.changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await models.Admin.findById(req.admin._id);
    if(!user){
      return response.notFound("user not found", res);
    }
  });

  