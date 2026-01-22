import { z } from 'zod';

const pricingSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.string().min(1, "Price is required"),
    period: z.string().optional(),
    description: z.string().optional(),
    features: z.array(z.string()).optional(),
    ctaText: z.string().optional(),
    isPopular: z.boolean().optional()
});

export { pricingSchema };
