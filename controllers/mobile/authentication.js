const response = require("./../../utils/response");
const helpers = require("./../../utils/helpers");
const { decrypt, encrypt } = require("./../../utils/encryptor");
const asyncHandler = require("express-async-handler");
const models = require("./../../models/zindex");

exports.signIn = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;
  let user = await models.users.findOne({ emailId: emailId }).lean();
  if (!user) {
    return response.success("Invalid credentials!", null, res);
  }

  let encryptedText = user.password;
  let plainText = decrypt(encryptedText);
  if (plainText != password) {
    return response.success("Invalid credentials!", null, res);
  }

  let token = helpers.generateToken({ id: String(user._id) });
  return response.success("User login successfully!", token, res);
});

exports.signUp = asyncHandler(async (req, res) => {
  const { name, emailId, password } = req.body;
  let user = await models.users.findOne({ emailId: emailId }).lean();
  if (user) {
    return response.success("Account is already exists!", null, res);
  }

  let encryptedText = encrypt(password);
  let result = await models.users.create({
    name,
    emailId,
    password: encryptedText,
  });
  let token = helpers.generateToken({ id: String(result._id) });
  return response.success("Account created successfully!", token, res);
});

exports.getUserById = asyncHandler(async (req, res) => {
  //Fetched req.token.id from middleware.
  const id = req.token.id;
  let user = await models.users
    .findById(id)
    .select("-password -createdAt -updatedAt")
    .lean();
  return response.success("User details fetched!", user, res);
});

exports.updateProfileImage = asyncHandler(async (req, res) => {
  //Fetched req.token.id from middleware.
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
