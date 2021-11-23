const appName = require("../config/config").APP_NAME;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

module.exports = {
  updateCommentPageRenderer: (req, res) => {
    const session = defaultSession;
    const comment = [];

    if (req.session && req.session.user) {
      session.email = req.session.user.email;
      session.token = req.session.user._id;
    }

    return res.render("update_comment", {
      session,
      comment,
      appName
    });
  }
};
