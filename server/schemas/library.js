import { z } from 'zod';

const librarySchema = z.object({
    title: z.string().min(1, "Title is required"),
    type: z.string().min(1, "Type is required"),
    description: z.string().optional(),
    tag: z.string().optional(),
    image_url: z.string().url("Invalid Image URL").optional().or(z.literal('')),
    link: z.string().url("Invalid Link URL").optional().or(z.literal(''))
});

export { librarySchema };
