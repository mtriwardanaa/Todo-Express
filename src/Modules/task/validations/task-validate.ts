import Joi from 'joi'

export const Schema = {
    create: Joi.object({
        name: Joi.string().min(3).max(25).required(),
        desc: Joi.string(),
        section_id: Joi.string().guid(),
        parent_id: Joi.string().guid(),
        due_date: Joi.date(),
        priority: Joi.number().positive().valid(1, 2, 3, 4),
    }),
    update: Joi.object({
        name: Joi.string().min(3).max(25).required(),
        desc: Joi.string(),
        new_parent_id: Joi.string().guid(),
        new_section_id: Joi.string().guid(),
        due_date: Joi.date(),
        priority: Joi.number().positive().valid(1, 2, 3, 4),
        completed: Joi.boolean(),
        order: Joi.number().positive,
    }),
}
