const appName = require("../config/config").APP_NAME;

module.exports = {
  aboutPageRenderer: (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    return res.render("about", { session, appName });
  },
  contactPageRenderer: (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    return res.render("contact", { session, appName });
  }
};
