const router = require("express").Router();

// account renderer
const {
  loginPageRenderer,
  logoutProcessor,
  signupPageRenderer,
  userProfilePageRenderer,
  forgetPasswordRenderer,
  passwordResetRenderer
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
router.get(
  "/setting/reset_password",
  authSessionRedirect,
  passwordResetRenderer
);

// forget password page
router.get(
  "/setting/forget_password",
  authSessionRedirect,
  forgetPasswordRenderer
);

// ########################## ACCOUNT PAGES ##########################
// signup page: signupPageRenderer
router.get("/account/signup", authSessionRedirect, signupPageRenderer);

// login page: loginPageRenderer
router.get("/account/login", authSessionRedirect, loginPageRenderer);

// logout: logoutProcessor
router.get("/account/logout", authNoSessionRedirect, logoutProcessor);

// ########################## ARTICLE PAGES ##########################
// TODO: read all articles, read 10 at a time, do it in the
// articleCollectionController
// TODO: look into reload on scroll functionality
// article page: readManyArticleRenderer
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
router.get(
  "/article/update/:articleId",
  authNoSessionRedirect,
  authSessionThenSetSession,
  updateArticlePageRenderer
);

// update comment page: updateCommentPageRenderer
router.get(
  "/comment/update/:commentId",
  authNoSessionRedirect,
  updateCommentPageRenderer
);

module.exports = router;
