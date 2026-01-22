import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    service: z.string().optional(),
    note: z.string().optional(),
    company: z.string().optional()
});

export { contactSchema };
