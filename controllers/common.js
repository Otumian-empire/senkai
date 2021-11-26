const appName = require("../config/config").APP_NAME;

module.exports = {
  aboutPageRenderer: (req, res) => {
    const session = req.session_;
    delete req.session_;

    return res.render("about", { session, appName });
  },
  contactPageRenderer: (req, res) => {
    const session = req.session_;
    delete req.session_;

    return res.render("contact", { session, appName });
  }
};
