import { z } from 'zod';

export const jobSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  url: z.union([z.string().url(), z.literal('')]).optional().nullable(),
  salary: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  workType: z.preprocess((val) => typeof val === 'string' ? val.toUpperCase() : val, z.enum(['REMOTE', 'ONSITE', 'HYBRID']).default('ONSITE')),
  location: z.string().optional().nullable(),
  jobFitPercentage: z.preprocess((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() !== '') return parseInt(val, 10);
    return 0;
  }, z.number().min(0).max(100).default(0)),
  status: z.string().default('wishlist'),
});

export const updateJobStatusSchema = z.object({
  status: z.string(),
  boardPosition: z.number().optional(),
});

export const updateJobDetailsSchema = jobSchema.partial().extend({
  finalOffer: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  nonMonetaryBenefits: z.string().optional().nullable(),
});
