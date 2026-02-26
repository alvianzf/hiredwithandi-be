import { z } from 'zod';
export declare const organizationSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export declare const studentSchema: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    orgId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    orgId: string;
}, {
    email: string;
    name: string;
    orgId: string;
}>;
