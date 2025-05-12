import Joi from "joi";
import regex from "../utils/regex.js";

const registerSchema = Joi.object({
  email: Joi.string()
    //   custom domain emails are allowed, for e. g. (example.mydomain.lt)
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email field cannot be empty",
      "string.max": "Email must not exceed 100 characters",
      "any.required": "Email is required.",
    }),

  password: Joi.string().pattern(regex.password).required().messages({
    "string.pattern.base":
      "Password must be from 8 to 30 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character",
    "string.empty": "Password field cannot be empty",
    "any.required": "Password is required",
  }),

  firstName: Joi.string().min(1).max(50).required().messages({
    "string.min": "First name should have at least 1 letter",
    "string.max": "First name must not exceed 50 characters",
    "string.empty": "First name field cannot be empty",
    "any.required": "First name is required.",
  }),

  lastName: Joi.string().min(1).max(50).required().messages({
    "string.min": "Last name should have at least 1 letter",
    "string.max": "Last name must not exceed 50 characters",
    "string.empty": "Last name field cannot be empty.",
    "any.required": "Last name is required.",
  }),
});

export default registerSchema;
