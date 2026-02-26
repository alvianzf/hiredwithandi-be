import { z } from 'zod';
export declare const organizationSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const studentSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    orgId: z.ZodString;
}, z.core.$strip>;
