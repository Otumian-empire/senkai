const bcrypt = require("bcrypt");

const appName = require("../config/config").APP_NAME;
const rounds = require("../config/config").ROUNDS;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

const User = require("../schemas").User;

module.exports = {
  logoutReDirecter: (req, res) => {
    const session = { ...req.session.user };
    const email = session && session.email ? session.email : "";

    let redirectUrl = "/account/login";

    if (email) {
      redirectUrl += `?email=${email}`;
    }

    delete req.session;

    return res.redirect(redirectUrl);
  },
  loginPageRenderer: (req, res) => {
    const session = defaultSession;
    const email = req.query.email;

    if (email) {
      session.email = email;
    }

    return res.render("login", {
      session,
      appName
    });
  },
  signupPageRenderer: (_req, res) => {
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

        bcrypt.hash(password, rounds, (err, hash) => {
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
