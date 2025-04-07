let mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    emailId: { type: String, default: "" },
    password: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", schema);
