const appName = require("../config/config").APP_NAME;
const Contact = require("../schemas").Contact;

const {
  CONTACT_US_SUBMITTED,
  AN_ERROR_OCCURRED
} = require("../utils/apiMessages");

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
  contactMeProcessor: async (req, res) => {
    let success = false;
    let message = AN_ERROR_OCCURRED;

    try {
      const { fullName, email, subject, content } = req.body;

      const contactMeInfo = await Contact.create({
        fullName,
        email,
        subject,
        content
      });
      if (contactMeInfo) {
        success = true;
        message = CONTACT_US_SUBMITTED;
      }

      return res.json({ success, message });
    } catch (err) {
      return res.json({ success, message });
    }
  }
};
