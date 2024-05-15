import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  phone: Joi.number().required().min(8),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  phone: Joi.number().min(8),
});
