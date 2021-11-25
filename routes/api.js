const router = require("express").Router();

const joiMiddleware = require("../utils/joiMiddleware");
const joiSchemas = require("../utils/joiSchemas");

const { signupProcessor, loginProcessor } = require("../controllers/account");

// ########################## SETTING PAGES ##########################
// setting routes
router.put("/setting/:field_name", (req, res) => {
  // TODO: update field name with the value passed in the request body
  // TODO: logout if there is any issue
  // TODO: this can not be used to reset the user email

  return res.json({
    index: "field_name"
  });
});

router.put("/setting/reset_password/:email", (req, res) => {
  // TODO: implement the password reset functionality

  return res.json({
    index: "reset_password"
  });
});

// ########################## COMMENT PAGES ##########################
// comment routes
router.post("/comment/:article_id", (req, res) => {
  // TODO: add comment
  return res.json({
    index: 1
  });
});

router.delete("/comment/:comment_id", (req, res) => {
  // TODO: delete comment by id and make sure the id is a uuid
  return res.json({
    index: 1
  });
});

router.get("/comment/:comment_id", (req, res) => {
  // TODO: read a comment by id
  return res.json({
    index: 1
  });
});

router.put("/comment/:comment_id", (req, res) => {
  // TODO: update comment by id
  return res.json({
    index: 1
  });
});

// ########################## ACCOUNT PAGES ##########################
// signup routes: signupProcessor
router.post(
  "/account/signup",
  joiMiddleware(joiSchemas.signupRequestBody),
  signupProcessor
);

// login route: loginProcessor
router.post(
  "/account/login",
  joiMiddleware(joiSchemas.loginRequestBody),
  loginProcessor
);

router.delete("/account/delete/:email", (req, res) => {
  // TODO: delete user account
  // TODO: ask user if they want to hibernate or delete
  // all data related to their account
  // TODO: logout user if session and email doesn't exist
  return res.json({
    index: 1
  });
});

// ########################## ARTICLE PAGES ##########################
// articles routes
router.put("/article/:article_id", (req, res) => {
  // TODO: update article by id
  // TODO: logout user if session and email and article does not belong to user
  // TODO: redirect to articles view
  return res.json({
    index: 1
  });
});

router.post("/article/create", (req, res) => {
  // TODO: on success, redirect to index view
  return res.json({
    index: "write_article"
  });
});

module.exports = router;
