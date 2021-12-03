const appName = require("../config/config").APP_NAME;
const Contact = require("../schemas").Contact;

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
  },
  contactMeProcessor: (req, res) => {
    const { fullName, email, subject, content } = req.body;
    let success = false;
    let message = "An error occurred, please try again in a few seconds";

    Contact.create({
      fullName,
      email,
      subject,
      content
    })
      .then((contactMeInfo) => {
        if (contactMeInfo) {
          success = true;
          message = "'Contact Us' is submitted";
        }

        return res.json({ success, message });
      })
      .catch(() => {
        return res.json({ success, message });
      });
  }
};
