const router = require("express").Router();

// account renderer
const {
  loginPageRenderer,
  logoutProcessor,
  signupPageRenderer,
  userProfilePageRenderer
} = require("../controllers").accountController;

// auth middleware
const {
  authSessionRedirect,
  authSessionThenSetSession,
  authNoSessionRedirect
} = require("../controllers").authMiddleware;

// article renderers
const {
  indexPageRenderer,
  readManyArticleRenderer,
  createArticlePageRenderer,
  readOneArticlePageRenderer,
  updateArticlePageRenderer
} = require("../controllers").articleController;

// comment renderers
const { updateCommentPageRenderer } =
  require("../controllers").commentController;

// common renderers
const { aboutPageRenderer, contactPageRenderer } =
  require("../controllers").commonController;

const appName = require("../config/config").APP_NAME;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

// ########################## COMMON PAGES ##########################
// index page
router.get("/", authSessionThenSetSession, indexPageRenderer);

// about page: aboutPageRenderer
router.get("/about", authSessionThenSetSession, aboutPageRenderer);

// contact page
router.get("/contact", authSessionThenSetSession, contactPageRenderer);

// ########################## SETTING PAGES ##########################
// user profile page: userProfilePageRenderer
router.get("/setting", authNoSessionRedirect, userProfilePageRenderer);

// password reset page
// TODO: implement the password reset functionality
router.get("/setting/reset_password", (req, res) => {
  return res.render("reset_password", {
    session: defaultSession,
    appName
  });
});

// forget password page
// TODO: implement the forget password functionality
router.get("/setting/forget_password", (req, res) => {
  return res.render("forget_password", {
    session: defaultSession,
    appName
  });
});

// ########################## ACCOUNT PAGES ##########################
// signup page: signupPageRenderer
router.get("/account/signup", authSessionRedirect, signupPageRenderer);

// login page: loginPageRenderer
router.get("/account/login", authSessionRedirect, loginPageRenderer);

// logout: logoutProcessor
router.get("/account/logout", authNoSessionRedirect, logoutProcessor);

// ########################## ARTICLE PAGES ##########################
// article page: readManyArticleRenderer
// TODO: read all articles, read 10 at a time, do it in the
// articleCollectionController
// TODO: look into reload on scroll functionality
router.get("/article", authSessionThenSetSession, readManyArticleRenderer);

// create article page: createArticlePageRenderer
router.get("/article/create", authNoSessionRedirect, createArticlePageRenderer);

// read article by id page: readOneArticlePageRenderer
router.get(
  "/article/:articleId",
  authSessionThenSetSession,
  readOneArticlePageRenderer
);

// update article page: updateArticlePageRenderer
// TODO: read article by id and pass it to the said view
router.get(
  "/article/update/:articleId",
  authNoSessionRedirect,
  authSessionThenSetSession,
  updateArticlePageRenderer
);

// update comment page: updateCommentPageRenderer
router.get(
  "/comment/update/:comment_id",
  authNoSessionRedirect,
  authSessionThenSetSession,
  updateCommentPageRenderer
);

module.exports = router;
