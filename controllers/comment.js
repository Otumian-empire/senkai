const appName = require("../config/config").APP_NAME;
const Comment = require("../schemas").Comment;

const {
  CREATED_SUCCESSFULLY,
  AN_ERROR_OCCURRED,
  UPDATE_SUCCESSFUL
} = require("../utils/apiMessages");

module.exports = {
  updateCommentPageRenderer: async (req, res) => {
    try {
      const session = req.session.user;
      const commentId = req.params.commentId;
      const email = req.session.user.email;

      const comment = await Comment.findOne({ _id: commentId });

      if (comment.email === email) {
        return res.render("update_comment", {
          session,
          comment,
          appName
        });
      }

      return res.redirect("/");
    } catch (err) {
      return res.redirect("/");
    }
  },
  updateCommentProcessor: async (req, res) => {
    let success = false;
    let message = AN_ERROR_OCCURRED;
    let articleId = 0;

    try {
      const commentId = req.params.commentId;
      const comment = req.body.comment;
      const email = req.session.user.email;

      const oldComment = await Comment.findOne({ _id: commentId, email });

      if (!oldComment) {
        return res.json({ success, message });
      }

      oldComment.text = comment;
      oldComment.updateAt = Date.now();
      articleId = oldComment.articleId;

      oldComment.save((err) => {
        if (!err) {
          success = true;
          message = UPDATE_SUCCESSFUL;
        }

        return res.json({ success, message, articleId });
      });
    } catch (err) {
      return res.json({ success, message });
    }
  },
  addCommentProcessor: async (req, res) => {
    let success = false;
    let message = AN_ERROR_OCCURRED;
    let articleId = 0;

    try {
      articleId = req.params.articleId;
      const comment = req.body.comment;
      const email = req.session.user.email;

      const commentAdded = await Comment.create({
        articleId,
        text: comment,
        email
      });

      if (commentAdded) {
        success = true;
        message = CREATED_SUCCESSFULLY;
      }

      return res.json({ success, message, articleId });
    } catch (err) {
      return res.json({ success, message });
    }
  }
};
