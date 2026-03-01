import { z } from 'zod';
export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(['SUPERADMIN', 'ADMIN', 'STUDENT']).default('STUDENT'),
    orgId: z.string().optional()
});
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});
export const checkEmailSchema = z.object({
    email: z.string().email()
});
export const refreshTokenSchema = z.object({
    refreshToken: z.string()
});
//# sourceMappingURL=auth.validator.js.map