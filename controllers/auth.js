const defaultSession = require("../utils/constants").DEFAULT_SESSION;

module.exports = {
  authSessionOrRedirect: (req, res, next) => {
    const authUser = { ...req.session.user };

    if (authUser && authUser.email && authUser.token) {
      delete req.session;
      return res.redirect("/");
    }

    next();
  },
  authSessionThenSetSession: (req, res, next) => {
    let session = defaultSession;
    const authUser = { ...req.session.user };

    if (authUser && authUser.email && authUser.token) {
      session = { ...authUser };
    }

    req.authUser = session;
    next();
  }
};
