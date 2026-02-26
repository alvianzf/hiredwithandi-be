import { z } from 'zod';

export const jobSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  url: z.string().url().optional().nullable(),
  salary: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  workType: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).default('ONSITE'),
  location: z.string().optional().nullable(),
  jobFitPercentage: z.number().min(0).max(100).default(0),
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
