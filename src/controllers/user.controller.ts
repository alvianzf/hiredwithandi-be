import { Request, Response } from 'express';
import { OrganizationService, UserService } from '../services/user.service.js';
import {
  organizationSchema,
  organizationUpdateSchema,
  profileUpdateSchema,
  userCreateSchema,
  userUpdateSchema,
  batchStudentSchema
} from '../validators/user.validator.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class OrganizationController {
  static async getAll(req: Request, res: Response) {
    try {
      const orgs = await OrganizationService.getAll();
      res.json({ data: orgs });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const validatedData = organizationSchema.parse(req.body);
      const org = await OrganizationService.create(validatedData);
      res.status(201).json({ data: org });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const validatedData = organizationUpdateSchema.parse(req.body);
      const org = await OrganizationService.update(req.params.id as string, validatedData);
      res.json({ data: org });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }
}

export class UserController {
  static async getStudents(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId && req.user?.role !== 'SUPERADMIN') {
        return res.status(403).json({ error: { message: 'Organization ID missing' } });
      }

      const students = await UserService.getStudentsByOrg(orgId!);
      res.json({ data: students });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const stats = await UserService.getSuperadminStats();
      res.json({ data: stats });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await UserService.getProfile(req.user!.id);
      res.json({ data: profile });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const validatedData = profileUpdateSchema.parse(req.body);
      const profile = await UserService.updateProfile(req.user!.id, validatedData);
      res.json({ data: profile });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAll();
      res.json({ data: users });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const validatedData = userCreateSchema.parse(req.body);
      const user = await UserService.createUser(validatedData);
      res.status(201).json({ data: user });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const validatedData = userUpdateSchema.parse(req.body);
      const user = await UserService.updateUser(req.params.id as string, validatedData);
      res.json({ data: user });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async batchCreateStudents(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.orgId;
      if (!orgId && req.user?.role !== 'SUPERADMIN') {
        return res.status(403).json({ error: { message: 'Organization ID missing' } });
      }

      const targetOrgId = req.body.orgId || orgId;
      if (!targetOrgId) {
        return res.status(400).json({ error: { message: 'orgId is required' } });
      }

      const validatedData = batchStudentSchema.parse(req.body.students);
      const result = await UserService.batchCreateStudents(targetOrgId, validatedData);
      res.status(201).json({ data: result });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }
}
