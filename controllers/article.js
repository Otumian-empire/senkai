const appName = require("../config/config").APP_NAME;
const Article = require("../schemas").Article;
const Comment = require("../schemas").Comment;

module.exports = {
  indexPageRenderer: (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    const articles = [];

    return res.render("index", {
      session,
      articles,
      appName
    });
  },
  readManyArticleRenderer: (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    const articles = [];

    return res.render("all_articles", {
      session,
      articles,
      appName
    });
  },
  createArticlePageRenderer: (req, res) => {
    const session = req.session.user;
    return res.render("create_article", { session, appName });
  },
  createArticleProcessor: (req, res) => {
    // TODO: work on the publish field, it is set to True by default in schema
    const { title, content } = req.body;
    const email = req.session.user.email;

    // TODO: use base64 encode on article and title before inserting
    // TODO: create a function in the utils folder for encoding and decoding

    Article.create({ title, content, email })
      .then((article) => {
        let success = false;
        let message = "An error occurred while creating the article";
        let articleId = "";

        if (article) {
          success = true;
          message = "article created successfully";
          articleId = article._id;
        }

        return res.json({ success, message, articleId });
      })
      .catch(() => {
        return res.json({ success: false, message: "An error ocurred" });
      });
  },
  readOneArticlePageRenderer: async (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    const articleId = req.params.articleId;

    let article = [];
    let comments = [];

    try {
      article = await Article.findOne({ _id: articleId });
      comments = await Comment.find({ articleId: articleId });
    } catch (err) {
      return res.redirect("/");
    }

    return res.render("article", {
      session,
      article,
      comments,
      appName
    });
  },
  updateArticlePageRenderer: (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    const article = [];

    return res.render("update_article", {
      session,
      article,
      appName
    });
  }
};
