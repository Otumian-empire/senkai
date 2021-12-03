const Joi = require("joi");
const { JoiPassword } = require("joi-password");

const schemas = {
  signupRequestBody: Joi.object().keys({
    firstName: Joi.string().min(2).max(20).trim().required(),
    lastName: Joi.string().min(2).max(20).trim().required(),
    email: Joi.string().trim().email().required(),
    password: JoiPassword.string()
      .min(8)
      .trim()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
    confirmPassword: JoiPassword.string()
      .min(8)
      .trim()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
    bio: Joi.string().trim()
  }),
  loginRequestBody: Joi.object().keys({
    email: Joi.string().trim().email().required(),
    password: JoiPassword.string()
      .min(8)
      .trim()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required()
  }),
  articleRequestBody: Joi.object().keys({
    title: Joi.string().min(15).max(256).trim().required(),
    content: Joi.string().min(15).max(2560).trim().required(),
    userEmail: Joi.string().trim().email().required(),
    publish: Joi.boolean().default(true)
  }),
  commentRequestBody: Joi.object().keys({
    postId: Joi.string().guid({ version: "uuidv4" }).required(),
    text: Joi.string().min(15).max(1286).trim().required(),
    userEmail: Joi.string().trim().email().required()
  }),
  tokenRequestBody: Joi.object().keys({
    text: Joi.string().alphanum().max(32).trim().required(),
    // Purpose is either EMAIL || PASSD
    purpose: Joi.string().length(5).trim().required(),
    userEmail: Joi.string().trim().email().required()
  }),
  passwordResetRequestBody: Joi.object().keys({
    userEmail: Joi.string().trim().email().required(),
    newPassword: JoiPassword.string()
      .min(8)
      .trim()
      .minOfSpecialCharacters(1)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required()
  }),
  forgetPasswordRequestBody: Joi.object().keys({
    userEmail: Joi.string().trim().email().required()
  }),
  contactMeRequestBody: Joi.object().keys({
    fullName: Joi.string().min(2).max(42).trim().required(),
    subject: Joi.string().min(5).max(150).trim().required(),
    content: Joi.string().min(15).max(1560).trim().required(),
    email: Joi.string().trim().email().required()
  })
};

module.exports = schemas;
