const defaultSession = require("../utils/constants").DEFAULT_SESSION;

module.exports = {
  authSessionOrRedirect: (req, res, next) => {
    const authUser = { ...req.session.user };

    if (authUser && authUser.email && authUser.token) {
      return res.redirect("/");
    }

    next();
  },
  authSessionThenSetSession: (req, res, next) => {
    const session = defaultSession;
    const authUser = { ...req.session.user };

    if (authUser && "email" in authUser && authUser.email) {
      session.email = req.session.user.email;
      session.token = req.session.user.token;
    }

    req.session_ = session;
    next();
  }
};
