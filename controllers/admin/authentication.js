const asyncHandler = require("express-async-handler");
const models = require("./../../models/zindex");
const { encrypt, decrypt } = require("./../../utils/encryptor");
const helpers = require("./../../utils/helpers");
const response = require("./../../utils/response");

exports.registerAdmin = asyncHandler(async (req, res) => {
  const { _id, name, emailId, password } = req.body;

  if (_id != null && _id != "") {
    await models.admin.findByIdAndUpdate(_id, { name, emailId }, { new: true });
    return response.success("Admin updated successfully!", true, res);
  } else {
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

    const token = helpers.generateToken({
      id: String(newAdmin._id),
      role: "admin",
    });
    return response.success("Admin registered successfully!", true, res);
  }
});

exports.getAdmins = asyncHandler(async (req, res) => {
  const { search } = req.body;

  let searchRegex = new RegExp(search, "i");
  let admins = await models.admin
    .find({
      $or: [{ emailId: searchRegex }, { name: searchRegex }],
    })
    .lean();
  return response.success("Admin already exists!", admins, res);
});

exports.deleteAdmins = asyncHandler(async (req, res) => {
  const { adminId } = req.body;
  let adminCount = await models.admin.countDocuments();
  if (adminCount == 1) {
    return response.success(
      "Cannot delete! There is only one admin left.",
      null,
      res
    );
  } else {
    await models.admin.findByIdAndDelete(adminId, { new: true });
    return response.success("Admin deleted success fully!", true, res);
  }
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

  admin = await models.admin
    .findByIdAndUpdate(admin._id, { lastLoginAt: new Date() })
    .select(
      "-lastLoginAt -lastPasswordResetAt -password -createdAt -updatedAt -__v"
    );

  const token = helpers.generateToken({ id: String(admin._id), role: "admin" });

  return response.success(
    "Admin logged in successfully!",
    { token, admin },
    res
  );
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  let result = await models.admin.findByIdAndUpdate(req.token.id, { name }, { new: true }).lean();
  let user = { _id: result._id, name: result.name, emailId: result.emailId };
  return response.success("Profile updated successfully!", user, res);
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  let existingAdmin = await models.admin.findById(req.token.id);
  if (existingAdmin) {
    let plainPassword = decrypt(existingAdmin.password);
    if (plainPassword == currentPassword) {
      existingAdmin.password = encrypt(newPassword);
      await existingAdmin.save();
      return response.success("Password updated successfully", true, res);
    }
    return response.success("Old password is not matching with current password!", null, res);
  }
  return response.success("Admin not found!", null, res);
})