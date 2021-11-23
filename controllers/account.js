const appName = require("../config/config").APP_NAME;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

module.exports = {
  loginPageRenderer: (req, res) => {
    const session = defaultSession;

    session.email =
      req.query.email || (req.session.user ? req.session.user.email : "");

    delete req.session.user;

    return res.render("login", { session, appName });
  },
  logoutReDirecter: (req, res) => {
    const email = req.session.user ? req.session.user.email : "";

    const redirectUrl = email
      ? `/account/login?email=${email}`
      : "/account/login";

    delete req.session.user;

    return res.redirect(redirectUrl);
  },
  signupPageRenderer: (req, res) => {
    const session = defaultSession;

    delete req.session.user;

    return res.render("signup", {
      session,
      appName
    });
  }
};
