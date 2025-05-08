const mongoose = require("mongoose");

const affirmationsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    description: { type: String, default: null },
    time: [
      {
        index: { type: Number },
        time: { type: String },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Affirmations", affirmationsSchema);
