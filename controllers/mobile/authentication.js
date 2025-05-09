const response = require("./../../utils/response");
const helpers = require("./../../utils/helpers");
const { decrypt, encrypt } = require("./../../utils/encryptor");
const asyncHandler = require("express-async-handler");
const models = require("./../../models/zindex");
const validator = require("./../../validators/user_validator");

exports.signIn = asyncHandler(async (req, res) => {
  const { emailId, password, socialId, signupType } = req.body;

  let user;
  let searchQuery = { emailId };
  user = await models.users.findOne(searchQuery).lean();

  if (!user || user.isDeleted) {
    return response.success("Invalid credentials!", null, res);
  }

  if (user.isBlocked) {
    return response.success("Account is blocked!", null, res);
  }

  if (signupType === 'Regular') {
    const decrypted = decrypt(user.password);
    if (decrypted !== password) {
      return response.success("Invalid credentials!", null, res);
    }
  } else if (["Apple", "Google"].includes(signupType)) {
    if (socialId != user.socialId) {
      return response.success("Invalid credentials!", null, res);
    }
  } else {
    return response.success("Invalid Login type found", null, res);
  }

  const token = helpers.generateToken({ id: String(user._id) });
  return response.success("User login successfully!", token, res);
});

exports.signUp = asyncHandler(async (req, res) => {
  const { error, value } = validator.saveUser.validate(req.body);
  if (error) {
    return response.success(error.details[0].message, null, res);
  }

  const {
    name,
    emailId,
    password,
    signupType,
    socialId,
  } = value;

  let searchQuery = { emailId };

  if (signupType === 'Google' || 'Apple' && socialId) {
    searchQuery = { $or: [{ socialId }, { emailId }] }
  }

  const user = await models.users.findOne(searchQuery).lean();

  if (user) {
    return response.success("Account already exists!", null, res);
  }

  const newUserData = {
    name,
    emailId,
    signupType,
    socialId,
    isVerified: signupType !== 'Regular',
  };

   if (signupType === 'Regular' && password) {
    newUserData.password = encrypt(password);
  }

  const result = await models.users.create(newUserData);
  const token = helpers.generateToken({ id: String(result._id) });

  return response.success("Account created successfully!", token, res);
});

exports.getProfile = asyncHandler(async (req, res) => {
  //Fetched req.token.id from middleware.
  const id = req.token.id;
  let user = await models.users
    .findById(id)
    .select("-password -createdAt -updatedAt")
    .lean();
  return response.success("User details fetched!", user, res);
});


exports.updateProfile = asyncHandler(async (req, res) => {
  const userId = req.token.id; 
  if (!userId) {
    return response.success("Unauthorized!", null, res);
  }

  const allowedFields = [
    "name",
    "topics",
    "isIntroPassed",
  ];

  const updateData = {};

  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updateData[key] = req.body[key];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return response.success("No valid fields provided for update!", null, res);
  }

  const updatedUser = await models.users.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, runValidators: true }
  ).select("-password -createdAt -updatedAt").lean();

  if (!updatedUser) {
    return response.success("User not found!", null, res);
  }

  return response.success("User updated successfully!", updatedUser, res);
});

exports.updateProfileImage = asyncHandler(async (req, res) => {
  const id = req.token.id;
  if (req.file != null) {
    await models.users.findByIdAndUpdate(
      id,
      { profileImage: req.file.path },
      { new: true }
    );
    return response.success(
      "Profile Image Updated!",
      { path: req.file.path },
      res
    );
  } else {
    return response.success("Please upload a file!", null, res);
  }
});
