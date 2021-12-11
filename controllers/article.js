const appName = require("../config/config").APP_NAME;
const Article = require("../schemas").Article;
const Comment = require("../schemas").Comment;

module.exports = {
  indexPageRenderer: async (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    let articles = [];

    try {
      articles = await Article.find().limit(5);
    } catch (err) {
      return res.redirect("/");
    }

    return res.render("index", {
      session,
      articles,
      appName
    });
  },
  readManyArticleRenderer: async (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    let articles = [];

    try {
      articles = await Article.find().limit(15).select("-content -updatedAt");
    } catch (err) {
      return res.redirect("/");
    }

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
  updateArticlePageRenderer: async (req, res) => {
    const session = req.authUser;
    delete req.authUser;

    let article = {};

    try {
      const articleId = req.params.articleId;
      article = await Article.findOne({ _id: articleId });
    } catch (err) {
      return res.redirect("/");
    }

    return res.render("update_article", {
      session,
      article,
      appName
    });
  },
  updateArticleProcessor: async (req, res) => {
    let success = false;
    let message = "An error occurred";

    try {
      const articleId = req.params.articleId;
      const { title, content } = req.body;

      const article = await Article.findOne({ _id: articleId });

      if (!article) {
        return res.json({ success, message });
      }

      article.title = title;
      article.content = content;
      article.updateAt = Date.now();

      article.save((err) => {
        if (!err) {
          success = true;
          message = "Update successful";
        }

        return res.json({ success, message });
      });
    } catch (err) {
      console.log(err);
      return res.json({ success, message });
    }
  }
};
