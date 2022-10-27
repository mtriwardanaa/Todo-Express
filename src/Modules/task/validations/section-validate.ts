import Joi from 'joi'

export const Schema = {
    create: Joi.object({
        name: Joi.string().min(3).max(25).required(),
    }),
    update: Joi.object({
        name: Joi.string().min(3).max(25).required(),
        order: Joi.number().positive(),
    }),
}
