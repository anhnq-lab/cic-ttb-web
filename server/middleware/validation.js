import { z } from 'zod';

const validate = (schema) => (req, res, next) => {
    try {
        // Validate request body against schema
        // We use parse method to validate. If strict validation is needed, use strict().
        // For query params or params validations, we could extend this, 
        // but currently we focus on Body for POST/PUT.
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: "Invalid input data",
                details: error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        next(error);
    }
};

export default validate;
