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
export declare const profileUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    linkedIn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    bio?: string | null | undefined;
    location?: string | null | undefined;
    linkedIn?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}, {
    name?: string | undefined;
    bio?: string | null | undefined;
    location?: string | null | undefined;
    linkedIn?: string | null | undefined;
    avatarUrl?: string | null | undefined;
}>;
