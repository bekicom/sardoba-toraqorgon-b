const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hall", hallSchema);
