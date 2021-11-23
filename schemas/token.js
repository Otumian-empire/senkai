const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    text: {
      type: String
    },
    dormancy: {
      type: Date,
      default: Date.now() + 1000 * 60 * 20
    },
    purpose: {
      type: String
    },
    userEmail: {
      type: String,
      unique: true,
      required: true,
      dropDups: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("token", tokenSchema);
