const defaultSession = require("../utils/constants").DEFAULT_SESSION;

module.exports = {
  authSessionOrRedirect: (req, res, next) => {
    const authUser = { ...req.session.user };

    if (authUser && authUser.email && authUser.token) {
      return res.redirect("/");
    }

    return next();
  },
  authSessionThenSetSession: (req, res, next) => {
    let session = defaultSession;
    const authUser = { ...req.session.user };

    if (authUser && authUser.email && authUser.token) {
      session = { ...authUser };
    }

    req.authUser = session;
    return next();
  }
};
