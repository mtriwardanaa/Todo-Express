import Joi from 'joi';

export const Schema = {
  create: Joi.object({
    name: Joi.string().min(3).max(25).required(),
    color: Joi.string()
      .regex(/^#[A-Fa-f0-9]{6}/)
      .required(),
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(25),
    color: Joi.string().regex(/^#[A-Fa-f0-9]{6}/),
    favorite: Joi.boolean(),
    archived: Joi.boolean(),
    order: Joi.number().positive(),
  }),
};
