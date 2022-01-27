const bcrypt = require("bcrypt");

const appName = require("../config/config").APP_NAME;
const rounds = require("../config/config").ROUNDS;
const defaultSession = require("../utils/constants").DEFAULT_SESSION;

const {
  PASSWORDS_DO_NOT_MATCH,
  INVALID_CREDENTIALS,
  SIGNUP_SUCCESSFUL,
  SIGNUP_UNSUCCESSFUL,
  AN_ERROR_OCCURRED,
  LOGIN_SUCCESSFUL,
  UPDATE_SUCCESSFUL,
  COULD_NOT_SEND_TOKEN,
  TOKEN_HAS_EXPIRED,
  INVALID_TOKEN,
  INVALID_PURPOSE
} = require("../utils/apiMessages");

const { User, Token } = require("../schemas");

module.exports = {
  logoutProcessor: (req, res) => {
    const session = { ...req.session.user };
    let redirectUrl = "/account/login";

    if (session && session.email) {
      redirectUrl += `?email=${session.email}`;
    }

    res.clearCookie("connect.sid");
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
  signupProcessor: async (req, res) => {
    try {
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const bio = req.body.bio;
      const password = req.body.password;
      const confirmPassword = req.body.confirmPassword;

      if (password !== confirmPassword) {
        return res.json({
          success: false,
          message: PASSWORDS_DO_NOT_MATCH
        });
      }

      const user = await User.findOne({ email });

      if (user) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      const hash = await bcrypt.hash(password, rounds);

      const newUser = await User.create({
        firstName,
        lastName,
        email,
        bio,
        password: hash
      });

      if (!newUser) {
        return res.json({
          success: false,
          message: SIGNUP_UNSUCCESSFUL
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
            message: AN_ERROR_OCCURRED
          });
        }

        return res.json({
          success: true,
          message: SIGNUP_SUCCESSFUL
        });
      });
    } catch (err) {
      return res.status(200).json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  },
  loginProcessor: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const user = await User.findOne({ email });

      if (!user) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      const passwordsMatches = await bcrypt.compare(password, user.password);

      if (!passwordsMatches) {
        return res.status(200).json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      req.session.user = { email: user.email, token: user._id.toString() };

      req.session.save((err) => {
        if (err) {
          return res.status(200).json({
            success: false,
            message: AN_ERROR_OCCURRED
          });
        }

        return res.json({
          success: true,
          message: LOGIN_SUCCESSFUL
        });
      });
    } catch (err) {
      return res.status(200).json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  },
  userProfilePageRenderer: async (req, res) => {
    try {
      const session = req.session.user;
      const email = session.email;

      const user = await User.findOne({ email }).select(
        "-password -createdAt -updatedAt"
      );

      if (!user) {
        return res.redirect("/account/logout");
      }

      return res.render("user_profile", {
        session,
        currentUser: user,
        appName
      });
    } catch (err) {
      return res.redirect("/account/logout");
    }
  },
  userProfileFieldUpdateProcessor: async (req, res) => {
    try {
      let success = false;
      let message = AN_ERROR_OCCURRED;

      const email = req.session.user.email;
      const token = req.params.token;

      const value = req.body.value;
      const fieldName = req.params.fieldName;

      if (fieldName === "password" || fieldName === "email") {
        return res.redirect("/setting");
      }

      const user = await User.findOne({ email, _id: token }).select(
        "-password -createdAt"
      );

      if (!user) {
        return res.redirect("/account/logout");
      }

      user[fieldName] = value;
      user.updateAt = Date.now();

      user.save((err) => {
        if (!err) {
          success = true;
          message = UPDATE_SUCCESSFUL;
        }

        return res.json({ success, message });
      });
    } catch (err) {
      res.redirect("/account/logout");
    }
  },
  forgetPasswordRenderer: async (_req, res) => {
    return res.render("forget_password", {
      session: defaultSession,
      appName
    });
  },
  forgetPasswordProcessor: async (req, res) => {
    try {
      const email = req.body.email;

      const user = await User.findOne({ email });

      if (!user) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      // insert token into database
      // TODO: implement function for token generation
      // default is GH123R (testing purpose)
      const token = "GH123R";

      // check if token is already set and drop then create new token
      const userToken = await Token.find({ email });

      if (userToken) {
        await Token.deleteOne({ email });
      }

      await Token.create({ token, purpose: "PASSD", email });

      // send user token via email
      // TODO: create a function so send user the password reset token
      const isEmailSent = true;

      if (!isEmailSent) {
        return res.json({
          success: false,
          message: COULD_NOT_SEND_TOKEN
        });
      }

      return res.json({
        success: true,
        message: `A token has being sent to ${email} to reset your password`
      });
    } catch (error) {
      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  },
  passwordResetRenderer: async (_req, res) => {
    return res.render("reset_password", {
      session: defaultSession,
      appName
    });
  },
  passwordResetProcessor: async (req, res) => {
    try {
      const { token, purpose, email, password } = req.body;

      const tokenObject = await Token.findOne({ email });

      if (!tokenObject) {
        return res.json({
          success: false,
          message: INVALID_CREDENTIALS
        });
      }

      if (Date.now() > tokenObject.dormancy) {
        // There is no need to delete the token row here since it will be
        // delete when the user makes the request again to the forget password
        // endpoint
        return res.json({
          success: false,
          message: TOKEN_HAS_EXPIRED
        });
      }

      if (purpose !== tokenObject.purpose) {
        return res.json({
          success: false,
          message: INVALID_PURPOSE
        });
      }

      if (token.toLowerCase() !== tokenObject.token.toLowerCase()) {
        return res.json({
          success: false,
          message: INVALID_TOKEN
        });
      }

      const hash = await bcrypt.hash(password, rounds);

      await User.updateOne({ email }, { password: hash });
      await Token.deleteOne({ email });

      return res.json({ success: true, message: UPDATE_SUCCESSFUL });
    } catch (error) {
      return res.json({
        success: false,
        message: AN_ERROR_OCCURRED
      });
    }
  }
};
