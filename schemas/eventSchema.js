import Joi from "joi";

export const eventSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title should be at least 3 characters long",
  }),
  description: Joi.string().allow("").max(2000).messages({
    "string.max": "Description should be at most 2000 characters",
  }),
  eventDate: Joi.date().iso().required().messages({
    "date.base": "Event date must be a valid date",
    "any.required": "Event date is required",
  }),
});
