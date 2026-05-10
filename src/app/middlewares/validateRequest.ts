
//for parsing input objects and validating them before they reach the controller

import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const validateRequest = (schema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body
        })
        return next() // going to next middleware

    } catch (err) {
        next(err);
    }
}

export default validateRequest;