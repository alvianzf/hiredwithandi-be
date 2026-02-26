import { z } from 'zod';
export declare const jobSchema: z.ZodObject<{
    company: z.ZodString;
    position: z.ZodString;
    url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    salary: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    workType: z.ZodDefault<z.ZodEnum<{
        REMOTE: "REMOTE";
        ONSITE: "ONSITE";
        HYBRID: "HYBRID";
    }>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    jobFitPercentage: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export declare const updateJobStatusSchema: z.ZodObject<{
    status: z.ZodString;
    boardPosition: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateJobDetailsSchema: z.ZodObject<{
    company: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    salary: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    workType: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        REMOTE: "REMOTE";
        ONSITE: "ONSITE";
        HYBRID: "HYBRID";
    }>>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    jobFitPercentage: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    finalOffer: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    benefits: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    nonMonetaryBenefits: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
