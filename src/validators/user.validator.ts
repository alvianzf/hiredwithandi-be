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

export const organizationUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  status: z.enum(['ACTIVE', 'DISABLED']).optional(),
});

export const userCreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'STUDENT']),
  orgId: z.string().optional(),
  password: z.string().min(6).optional(), // Can provide default if empty
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'STUDENT']).optional(),
  status: z.enum(['ACTIVE', 'DISABLED']).optional(),
  orgId: z.string().optional(),
});

export const batchStudentSchema = z.array(
  z.object({
    name: z.string().min(2),
    email: z.string().email(),
  })
);
