import { z } from 'zod';
export const organizationSchema = z.object({
    name: z.string().min(2)
});
export const studentSchema = z.object({
    email: z.string().email(),
    name: z.string().min(2),
    orgId: z.string()
});
//# sourceMappingURL=user.validator.js.map