const mongoose = require("mongoose");

const affirmationsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    description: String,
    time: [
      {
        index: String,
        time: String,
      }
    ], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Affirmations", affirmationsSchema);
