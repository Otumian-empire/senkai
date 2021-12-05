const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    articleId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
