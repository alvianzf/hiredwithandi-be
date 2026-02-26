import { z } from 'zod';
export const organizationSchema = z.object({
    name: z.string().min(2)
});
export const studentSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    orgId: z.string()
});
export const profileUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    bio: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    linkedIn: z.string().url().optional().nullable(),
    avatarUrl: z.string().optional().nullable(), // For Base64 data
});
//# sourceMappingURL=user.validator.js.map