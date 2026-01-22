import { z } from 'zod';

const newsSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    category: z.string().min(1, "Category is required"),
    date: z.string().optional(), // Should be date string if provided
    imageUrl: z.string().url("Invalid Image URL").optional().or(z.literal('')),
    excerpt: z.string().optional(),
    content: z.string().min(10, "Content must be at least 10 characters"),
    author: z.string().optional(),
    videoUrl: z.string().url("Invalid Video URL").optional().or(z.literal('')),
    audioUrl: z.string().url("Invalid Audio URL").optional().or(z.literal('')),
    attachments: z.any().optional(), // Can be updated to more specific schema if structure is known
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.string().optional().or(z.array(z.string()))
});

export { newsSchema };
