const appName = require("../config/config").APP_NAME;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;
const User = require("../schemas").User;
const bcrypt = require("bcrypt");

module.exports = {
  authenticateSession: (req, res, next) => {
    const authUser = { ...req.session.user };

    if (authUser && authUser.email && authUser.token) {
      return res.redirect("/");
    }

    next();
  },
  logoutReDirecter: (req, res) => {
    const authUser = { ...req.session.user };

    const email = authUser ? authUser.email : "";

    const redirectUrl = email
      ? `/account/login?email=${email}`
      : "/account/login";

    if (authUser && authUser.email && authUser.token) {
      delete req.session.user;
    }

    return res.redirect(redirectUrl);
  },
  loginPageRenderer: (req, res) => {
    const session = defaultSession;

    return res.render("login", {
      session,
      appName
    });
  },
  signupPageRenderer: (req, res) => {
    const session = defaultSession;

    return res.render("signup", {
      session,
      appName
    });
  },
  signupProcessor: (req, res) => {
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
  },
  loginProcessor: (req, res) => {
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
};
