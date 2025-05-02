const mongoose = require("mongoose");

const journalsSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      reflectionAnalysis: Object,
      type: { type: String, enum: ['journal', 'morning-reflection', 'evening-reflection'] },
      questionAnswers: [Object],
      isDraft: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Journals", journalsSchema);