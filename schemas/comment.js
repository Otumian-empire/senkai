const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
