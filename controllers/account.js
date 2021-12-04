const bcrypt = require("bcrypt");

const appName = require("../config/config").APP_NAME;
const rounds = require("../config/config").ROUNDS;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

const User = require("../schemas").User;

module.exports = {
  logoutProcessor: (req, res) => {
    const session = { ...req.session.user };
    let redirectUrl = "/account/login";

    if (session && session.email) {
      redirectUrl += `?email=${session.email}`;
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
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const bio = req.body.bio;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

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

    User.findOne({ email })
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
  },
  userProfilePageRenderer: (req, res) => {
    const session = req.session.user;
    const email = session.email;

    User.findOne({ email })
      .select("-password -createdAt -updatedAt")
      .then((user) => {
        if (!user) {
          return res.redirect("/account/logout");
        }

        return res.render("user_profile", {
          session,
          currentUser: user,
          appName
        });
      })
      .catch(() => res.redirect("/account/logout"));
  },
  userProfileFieldUpdateProcessor: (req, res) => {
    const email = req.session.user.email;
    const token = req.params.token;

    const value = req.body.value;
    const fieldName = req.params.fieldName;

    if (fieldName === "password" || fieldName === "email") {
      return res.redirect("/setting");
    }

    User.findOne({ email, _id: token })
      .select("-password -createdAt")
      .then((user) => {
        if (!user) {
          return res.redirect("/account/logout");
        }

        user[fieldName] = value;
        user.updateAt = Date.now();

        user.save((err) => {
          let success = false;
          let message = "An error occurred";

          if (!err) {
            success = true;
            message = "Update successful";
          }

          return res.json({ success, message });
        });
      })
      .catch(() => res.redirect("/account/logout"));
  }
};
