const appName = require("../config/config").APP_NAME;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

module.exports = {
  aboutPageRenderer: (req, res) => {
    const session = defaultSession;

    if (req.session && req.session.user) {
      session.email = req.session.user.email;
      session.token = req.session.user._id;
    }

    return res.render("about", { session, appName });
  },
  contactPageRenderer: (req, res) => {
    const session = defaultSession;

    if (req.session && req.session.user) {
      session.email = req.session.user.email;
      session.token = req.session.user._id;
    }

    return res.render("contact", { session, appName });
  }
};
