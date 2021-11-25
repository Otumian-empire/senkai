const router = require("express").Router();

const {
  loginPageRenderer,
  logoutReDirecter,
  signupPageRenderer,
  authenticateSession
} = require("../controllers").accountController;

const {
  indexPageRenderer,
  readManyArticleRenderer,
  createArticlePageRenderer,
  readOneArticlePageRenderer,
  updateArticlePageRenderer
} = require("../controllers").articleController;

const { updateCommentPageRenderer } =
  require("../controllers").commentController;

const { aboutPageRenderer, contactPageRenderer } =
  require("../controllers").commonController;

const appName = require("../config/config").APP_NAME;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

// ########################## COMMON PAGES ##########################
// index page
// TODO: read all articles and send to the index view when the page loads
// TODO: add pagination to reading all articles, read 5 at a time
// TODO: check whether a user object is set on the session object
// then assign the the user email and _id as token to the session
router.get("/", indexPageRenderer);

// about page: aboutPageRenderer
router.get("/about", aboutPageRenderer);

// contact page
// TODO: create a model/schema for the contact me
// look on the contact page to see which fields are needed
router.get("/contact", contactPageRenderer);

// ########################## SETTING PAGES ##########################
// user profile page
// TODO: read user data and display it in the user setting view
// TODO: logout user when there is not session
// TODO: if there is any error, logout user
// TODO: when things don't add up, redirect to the login page
router.get("/setting", (req, res) => {
  return res.render("user_profile", {
    session: defaultSession,
    currentUser: {},
    appName
  });
});

// password reset page
// TODO: implement the password reset functionality
router.get("/setting/reset_password", (req, res) => {
  return res.render("reset_password", {
    session: defaultSession,
    appName
  });
});

// forget password page
// TODO: implement the password reset functionality
router.get("/setting/forget_password", (req, res) => {
  return res.render("forget_password", {
    session: defaultSession,
    appName
  });
});

// ########################## ACCOUNT PAGES ##########################
// signup page: signupPageRenderer
router.get("/account/signup", authenticateSession, signupPageRenderer);

// login page: loginPageRenderer
router.get("/account/login", authenticateSession, loginPageRenderer);

// logout: logoutReDirecter
router.get("/account/logout", authenticateSession, logoutReDirecter);

// ########################## ARTICLE PAGES ##########################
// article page: readManyArticleRenderer
// TODO: read all articles, read 10 at a time, do it in the
// articleCollectionController
// TODO: look into reload on scroll functionality
router.get("/article", readManyArticleRenderer);

// create article page: createArticlePageRenderer
// TODO: on success, redirect to article page with this articles id
// do it with jquery
router.get("/article/create", createArticlePageRenderer);

// read article by id page: readOneArticlePageRenderer
// TODO: read article by id
// TODO: read article's comments
router.get("/article/:article_id", readOneArticlePageRenderer);

// update article page: updateArticlePageRenderer
// TODO: read article by id and pass it to the said view
router.get("/article/update/:article_id", updateArticlePageRenderer);

// ########################## COMMENT PAGES ##########################
// update comment page: updateCommentPageRenderer
router.get("/comment/update/:comment_id", updateCommentPageRenderer);

module.exports = router;
