const { z } = require('zod');

const toolSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    icon: z.string().optional(), // Could be URL or class name
    link: z.string().url("Invalid Link URL").optional().or(z.literal(''))
});

module.exports = { toolSchema };
