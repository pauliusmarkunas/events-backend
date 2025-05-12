import Joi from "joi";

export const guestSchema = Joi.object({
  eventId: Joi.number().integer().required().messages({
    "number.base": "Event ID must be a number",
    "number.integer": "Event ID must be an integer",
    "any.required": "Event ID is required",
  }),
  fullName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name should be at least 3 characters long",
    "string.max": "Full name should be at most 100 characters long",
  }),
  email: Joi.string()
    //   custom domain emails are allowed, for e. g. (example.mydomain.lt)
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "string.email": "Email must be a valid email address",
      "string.empty": "Email field cannot be empty",
      "string.max": "Email must not exceed 100 characters",
      "any.required": "Email is required",
    }),
  age: Joi.number().integer().min(0).max(120).required().messages({
    "number.base": "Age must be a number",
    "number.integer": "Age must be an integer",
    "number.min": "Age cannot be less than 0",
    "number.max": "Age cannot be greater than 120",
    "any.required": "Age is required",
  }),
  birthYear: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .messages({
      "number.base": "Birth year must be a number",
      "number.integer": "Birth year must be an integer",
      "number.min": "Birth year cannot be earlier than 1900",
      "number.max": `Birth year cannot be later than ${new Date().getFullYear()}`,
    }),
});
