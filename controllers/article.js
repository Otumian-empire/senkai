const appName = require("../config/config").APP_NAME;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

module.exports = {
  indexPageRenderer: (req, res) => {
    const session = defaultSession;
    const articles = [];

    if (req.session && req.session.user) {
      session.email = req.session.user.email;
      session.token = req.session.user._id;
    }

    return res.render("index", {
      session,
      articles,
      appName
    });
  },
  readManyArticleRenderer: (req, res) => {
    const session = defaultSession;
    const articles = [];

    if (req.session && req.session.user) {
      session.email = req.session.user.email;
      session.token = req.session.user._id;
    }

    return res.render("all_articles", {
      session,
      articles,
      appName
    });
  },
  createArticlePageRenderer: (req, res) => {
    const session = defaultSession;

    if (!req.session || !req.session.user) {
      return res.redirect("/");
    }

    session.email = req.session.user.email;
    session.token = req.session.user._id;

    return res.render("create_article", { session, appName });
  },
  readOneArticlePageRenderer: (req, res) => {
    const session = defaultSession;
    const article = [];
    const comments = [];

    if (req.session && req.session.user) {
      session.email = req.session.user.email;
      session.token = req.session.user._id;
    }

    return res.render("article", {
      session,
      article,
      comments,
      appName
    });
  },
  updateArticlePageRenderer: (req, res) => {
    const session = defaultSession;
    const article = [];

    if (req.session && req.session.user) {
      session.email = req.session.user.email;
      session.token = req.session.user._id;
    }

    return res.render("update_article", {
      session,
      article,
      appName
    });
  }
};
