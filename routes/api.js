const router = require("express").Router();

const joiMiddleware = require("../utils/joiMiddleware");
const joiSchemas = require("../utils/joiSchemas");

// auth middleware
const { authSessionRedirect, authNoSessionRedirect } =
  require("../controllers").authMiddleware;

// account controllers
const {
  signupProcessor,
  loginProcessor,
  userProfileFieldUpdateProcessor,
  forgetPasswordProcessor,
  passwordResetProcessor
} = require("../controllers/account");

// common controllers
const { contactMeProcessor } = require("../controllers/common");

// article controllers
const {
  createArticleProcessor,
  updateArticleProcessor,
  deleteArticleProcessor
} = require("../controllers/article");

// comment controllers
const {
  addCommentProcessor,
  updateCommentProcessor,
  deleteCommentProcessor
} = require("../controllers/comment");

// ########################## SETTING PAGES ##########################
// setting routes
router.put(
  "/setting/:token/:fieldName",
  authNoSessionRedirect,
  joiMiddleware(joiSchemas.updateSettingParameterBody, "params"),
  joiMiddleware(joiSchemas.updateSettingRequestBody),
  userProfileFieldUpdateProcessor
);

// forget password
router.post(
  "/setting/forget_password",
  authSessionRedirect,
  joiMiddleware(joiSchemas.forgetPasswordRequestBody),
  forgetPasswordProcessor
);

// reset password
router.post(
  "/setting/reset_password",
  joiMiddleware(joiSchemas.passwordResetRequestBody),
  passwordResetProcessor
);

// ########################## COMMENT PAGES ##########################
// comment routes: addCommentProcessor
router.post("/comment/:articleId", authNoSessionRedirect, addCommentProcessor);

// delete comment: deleteCommentProcessor
router.delete(
  "/comment/:commentId",
  authNoSessionRedirect,
  deleteCommentProcessor
);

// update comment: updateCommentProcessor
router.put(
  "/comment/:commentId",
  authNoSessionRedirect,
  updateCommentProcessor
);

// ########################## ACCOUNT PAGES ##########################
// signup routes: signupProcessor
router.post(
  "/account/signup",
  authSessionRedirect,
  joiMiddleware(joiSchemas.signupRequestBody),
  signupProcessor
);

// login route: loginProcessor
router.post(
  "/account/login",
  authSessionRedirect,
  joiMiddleware(joiSchemas.loginRequestBody),
  loginProcessor
);

// delete account route: deleteAccountProcessor
router.delete("/account/delete/:email", authSessionRedirect, (req, res) => {
  // TODO: delete user account
  // TODO: ask user if they want to hibernate or delete
  // all data related to their account
  // TODO: logout user if session and email doesn't exist
  return res.json({
    index: 1
  });
});

// ########################## ARTICLE PAGES ##########################
// articles routes: updateArticleProcessor
router.put(
  "/article/:articleId",
  authNoSessionRedirect,
  joiMiddleware(joiSchemas.articleRequestBody),
  updateArticleProcessor
);

// delete article routes: deleteArticleProcessor
router.delete(
  "/article/:articleId",
  authNoSessionRedirect,
  deleteArticleProcessor
);

// create article: createArticleProcessor
router.post(
  "/article/create",
  authNoSessionRedirect,
  joiMiddleware(joiSchemas.articleRequestBody),
  createArticleProcessor
);

// ########################## CONTACT PAGE ##########################
// contact route: contactMeProcessor
router.post(
  "/contact",
  joiMiddleware(joiSchemas.contactMeRequestBody),
  contactMeProcessor
);

module.exports = router;
