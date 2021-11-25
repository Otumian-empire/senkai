const Joi = require("joi");
const { JoiPassword } = require("joi-password");

const schemas = {
  signupRequestBody: Joi.object().keys({
    first_name: Joi.string().min(2).max(20).trim().required(),
    last_name: Joi.string().min(2).max(20).trim().required(),
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
    confirm_password: JoiPassword.string()
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
    user_email: Joi.string().trim().email().required(),
    publish: Joi.boolean().default(true)
  }),
  commentRequestBody: Joi.object().keys({
    post_id: Joi.string().guid({ version: "uuidv4" }).required(),
    text: Joi.string().min(15).max(1286).trim().required(),
    user_email: Joi.string().trim().email().required()
  }),
  tokenRequestBody: Joi.object().keys({
    text: Joi.string().alphanum().max(32).trim().required(),
    // Purpose is either EMAIL || PASSD
    purpose: Joi.string().length(5).trim().required(),
    user_email: Joi.string().trim().email().required()
  }),
  passwordResetRequestBody: Joi.object().keys({
    user_email: Joi.string().trim().email().required(),
    new_password: JoiPassword.string()
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
    user_email: Joi.string().trim().email().required()
  })
};

module.exports = schemas;
