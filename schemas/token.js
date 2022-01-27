const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String
    },
    dormancy: {
      type: Date,
      default: Date.now() + 1000 * 60 * 20
    },
    purpose: {
      type: String
    },
    email: {
      type: String,
      unique: true,
      required: true,
      dropDups: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("token", tokenSchema);
