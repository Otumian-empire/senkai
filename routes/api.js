const router = require("express").Router();
const bcrypt = require("bcrypt");

const joiMiddleware = require("../utils/joiMiddleware");
const joiSchemas = require("../utils/joiSchemas");

const User = require("../schemas").User;

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
// signup routes
router.post(
  "/account/signup",
  joiMiddleware(joiSchemas.signupRequestBody),
  (req, res) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const bio = req.body.bio;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;

    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "passwords do not match"
      });
    }

    User.findOne({
      email
    })
      .then((user) => {
        if (user) {
          return res.json({
            success: false,
            message: "Kindly login, email already exists"
          });
        }

        bcrypt.hash(password, 12, (err, hash) => {
          if (err) {
            return res.status(200).json({
              success: false,
              message: "An error occurred"
            });
          }

          User.create({
            firstName,
            lastName,
            email,
            bio,
            password: hash
          })
            .then((newUser) => {
              if (!newUser) {
                return res.json({
                  success: false,
                  message: "Signup unsuccessful"
                });
              }

              req.session.user = {
                email: newUser.email,
                token: newUser._id.toString()
              };

              req.session.save((err) => {
                if (err) {
                  return res.status(200).json({
                    success: false,
                    message: "An error occurred"
                  });
                }

                return res.json({
                  success: true,
                  message: "Signup successful"
                });
              });
            })
            .catch(() => {
              return res.status(200).json({
                success: false,
                message: "An error occurred"
              });
            });
        });
      })
      .catch(() => {
        return res.status(200).json({
          success: false,
          message: "An error occurred"
        });
      });
  }
);
// login route:
router.post(
  "/account/login",
  joiMiddleware(joiSchemas.loginRequestBody),
  (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
      email
    })
      .then((user) => {
        if (!user) {
          return res.json({
            success: false,
            message: "Kindly signup"
          });
        }

        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            return res.status(200).json({
              success: false,
              message: "An error Occurred"
            });
          }

          if (!match) {
            return res.status(200).json({
              success: false,
              message: "Invalid login credentials"
            });
          }

          req.session.user = { email: user.email, token: user._id.toString() };

          req.session.save((err) => {
            if (err) {
              return res.status(200).json({
                success: false,
                message: "An error occurred"
              });
            }

            return res.json({
              success: true,
              message: "login successful"
            });
          });
        });
      })
      .catch(() => {
        return res.status(200).json({
          success: false,
          message: "An error occurred"
        });
      });
  }
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
