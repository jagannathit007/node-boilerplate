const asyncHandler = require("express-async-handler");
const models = require("./../../models/zindex");
const { encrypt, decrypt } = require("./../../utils/encryptor");
const helpers = require("./../../utils/helpers");
const response = require("./../../utils/response");


exports.registerAdmin = asyncHandler(async (req, res) => {
  const { name, emailId, password } = req.body;

  let existingAdmin = await models.admin.findOne({ emailId }).lean();
  if (existingAdmin) {
    return response.success("Admin already exists!", null, res);
  }

  const encryptedPassword = encrypt(password);

  const newAdmin = await models.admin.create({
    name,
    emailId,
    password: encryptedPassword,
    lastLoginAt: null,
    lastPasswordResetAt: new Date(),
  });

  const token = helpers.generateToken({ id: String(newAdmin._id), role: "admin" });

  return response.success("Admin registered successfully!", { token, admin: newAdmin }, res);
});


exports.loginAdmin = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;

  let admin = await models.admin.findOne({ emailId }).lean();
  if (!admin) {
    return response.success("Invalid credentials!", null, res);
  }

  const decryptedPassword = decrypt(admin.password);
  if (decryptedPassword !== password) {
    return response.success("Invalid credentials!", null, res);
  }

  admin = await models.admin.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() }).select('-lastLoginAt -lastPasswordResetAt -password -createdAt -updatedAt -__v');

  const token = helpers.generateToken({ id: String(admin._id), role: "admin" });

  return response.success("Admin logged in successfully!", { token, admin }, res);
});
