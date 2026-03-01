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
export declare const organizationUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
}, {
    name?: string | undefined;
}>;
export declare const userCreateSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["SUPERADMIN", "ADMIN", "STUDENT"]>;
    orgId: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    role: "SUPERADMIN" | "ADMIN" | "STUDENT";
    orgId?: string | undefined;
    password?: string | undefined;
}, {
    email: string;
    name: string;
    role: "SUPERADMIN" | "ADMIN" | "STUDENT";
    orgId?: string | undefined;
    password?: string | undefined;
}>;
export declare const userUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["SUPERADMIN", "ADMIN", "STUDENT"]>>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "DISABLED"]>>;
    orgId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    role?: "SUPERADMIN" | "ADMIN" | "STUDENT" | undefined;
    status?: "ACTIVE" | "DISABLED" | undefined;
    orgId?: string | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    role?: "SUPERADMIN" | "ADMIN" | "STUDENT" | undefined;
    status?: "ACTIVE" | "DISABLED" | undefined;
    orgId?: string | undefined;
}>;
export declare const batchStudentSchema: z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
}, {
    email: string;
    name: string;
}>, "many">;
