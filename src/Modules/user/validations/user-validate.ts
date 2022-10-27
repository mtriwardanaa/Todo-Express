import Joi from 'joi'

export const Schema = {
    create: Joi.object({
        name: Joi.string().min(3).max(15).required(),
        username: Joi.string().alphanum().min(3).max(15).trim(true).required(),
        password: Joi.string()
            .trim(true)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
    }),
    update: Joi.object({
        name: Joi.string().min(3).max(15).required(),
        username: Joi.string().alphanum().min(3).max(15).trim(true),
        password: Joi.string()
            .trim(true)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        active: Joi.boolean(),
    }),
    login: Joi.object({
        username: Joi.string().alphanum().min(3).max(15).trim(true).required(),
        password: Joi.string()
            .trim(true)
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
            .required(),
    }),
}
