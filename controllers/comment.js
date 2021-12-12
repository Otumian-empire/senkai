const appName = require("../config/config").APP_NAME;
const Comment = require("../schemas").Comment;

module.exports = {
  updateCommentPageRenderer: async (req, res) => {
    const session = req.session.user;
    const commentId = req.params.commentId;
    const email = req.session.user.email;

    await Comment.findOne({ _id: commentId })
      .then((comment) => {
        if (comment.email === email) {
          return res.render("update_comment", {
            session,
            comment,
            appName
          });
        }

        return res.redirect("/");
      })
      .catch(() => res.redirect("/"));
  },
  updateCommentProcessor: async (req, res) => {
    let success = false;
    let message = "An error occurred";
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
          message = "Comment added successfully";
        }

        return res.json({ success, message, articleId });
      });
    } catch (err) {
      return res.json({ success, message });
    }
  },
  addCommentProcessor: async (req, res) => {
    let success = false;
    let message = "An error occurred";
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
        message = "Comment updated successfully";
      }

      return res.json({ success, message, articleId });
    } catch (err) {
      return res.json({ success, message });
    }
  }
};
