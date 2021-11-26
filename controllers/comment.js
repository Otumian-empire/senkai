const appName = require("../config/config").APP_NAME;

module.exports = {
  updateCommentPageRenderer: (req, res) => {
    const session = req.session_;
    delete req.session_;

    const comment = [];

    return res.render("update_comment", {
      session,
      comment,
      appName
    });
  }
};
