import { NextFunction, Request, Response } from 'express'
import { ObjectSchema } from 'joi'

export const ValidateJoi = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body)
            next()
        } catch (error) {
            console.log(error)
            let msg = (error as Error).message
            return res.status(422).json({ status: 'fail', message: msg })
        }
    }
}
