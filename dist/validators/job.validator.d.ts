import { z } from 'zod';
export declare const jobSchema: z.ZodObject<{
    company: z.ZodString;
    position: z.ZodString;
    url: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>;
    salary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    workType: z.ZodEffects<z.ZodDefault<z.ZodEnum<["REMOTE", "ONSITE", "HYBRID"]>>, "REMOTE" | "ONSITE" | "HYBRID", unknown>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    jobFitPercentage: z.ZodEffects<z.ZodDefault<z.ZodNumber>, number, unknown>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    company: string;
    position: string;
    workType: "REMOTE" | "ONSITE" | "HYBRID";
    jobFitPercentage: number;
    location?: string | null | undefined;
    url?: string | null | undefined;
    salary?: string | null | undefined;
    notes?: string | null | undefined;
}, {
    company: string;
    position: string;
    status?: string | undefined;
    location?: string | null | undefined;
    url?: string | null | undefined;
    salary?: string | null | undefined;
    notes?: string | null | undefined;
    workType?: unknown;
    jobFitPercentage?: unknown;
}>;
export declare const updateJobStatusSchema: z.ZodObject<{
    status: z.ZodString;
    boardPosition: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    status: string;
    boardPosition?: number | undefined;
}, {
    status: string;
    boardPosition?: number | undefined;
}>;
export declare const updateJobDetailsSchema: z.ZodObject<{
    company: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodLiteral<"">]>>>>;
    salary: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    workType: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodEnum<["REMOTE", "ONSITE", "HYBRID"]>>, "REMOTE" | "ONSITE" | "HYBRID", unknown>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    jobFitPercentage: z.ZodOptional<z.ZodEffects<z.ZodDefault<z.ZodNumber>, number, unknown>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodString>>;
} & {
    finalOffer: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    benefits: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    nonMonetaryBenefits: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: string | undefined;
    location?: string | null | undefined;
    company?: string | undefined;
    position?: string | undefined;
    url?: string | null | undefined;
    salary?: string | null | undefined;
    notes?: string | null | undefined;
    workType?: "REMOTE" | "ONSITE" | "HYBRID" | undefined;
    finalOffer?: string | null | undefined;
    benefits?: string | null | undefined;
    nonMonetaryBenefits?: string | null | undefined;
    jobFitPercentage?: number | undefined;
}, {
    status?: string | undefined;
    location?: string | null | undefined;
    company?: string | undefined;
    position?: string | undefined;
    url?: string | null | undefined;
    salary?: string | null | undefined;
    notes?: string | null | undefined;
    workType?: unknown;
    finalOffer?: string | null | undefined;
    benefits?: string | null | undefined;
    nonMonetaryBenefits?: string | null | undefined;
    jobFitPercentage?: unknown;
}>;
