const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      default: "I am new here!!"
    },
    email: {
      type: String,
      unique: true,
      dropDups: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
