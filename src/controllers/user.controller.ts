import { Request, Response } from 'express';
import { OrganizationService, UserService } from '../services/user.service.js';
import { organizationSchema } from '../validators/user.validator.js';
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
}
