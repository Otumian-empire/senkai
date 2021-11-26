const appName = require("../config/config").APP_NAME;

module.exports = {
  indexPageRenderer: (req, res) => {
    const session = req.session_;
    delete req.session_;

    const articles = [];

    return res.render("index", {
      session,
      articles,
      appName
    });
  },
  readManyArticleRenderer: (req, res) => {
    const session = req.session_;
    delete req.session_;

    const articles = [];

    return res.render("all_articles", {
      session,
      articles,
      appName
    });
  },
  createArticlePageRenderer: (req, res) => {
    if (!req.session_) {
      return res.redirect("/account/login");
    }

    const session = req.session_;
    delete req.session_;

    return res.render("create_article", { session, appName });
  },
  readOneArticlePageRenderer: (req, res) => {
    const session = req.session_;
    delete req.session_;

    const article = [];
    const comments = [];

    return res.render("article", {
      session,
      article,
      comments,
      appName
    });
  },
  updateArticlePageRenderer: (req, res) => {
    const session = req.session_;
    delete req.session_;

    const article = [];

    return res.render("update_article", {
      session,
      article,
      appName
    });
  }
};
