import { Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { UserService } from '../services/user.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import prisma from '../config/prisma.js';

export class AnalyticsController {
  static async getUserStats(req: AuthRequest, res: Response) {
    try {
      const stats = await AnalyticsService.getUserStats(req.user!.id);
      res.json({ data: stats });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async getOrgStats(req: AuthRequest, res: Response) {
    try {
      const id = req.params['id'] as string;
      const stats = await AnalyticsService.getOrgStats(id);
      res.json({ data: stats });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async getMemberStats(req: AuthRequest, res: Response) {
    try {
      const id = req.params['id'] as string;
      // Re-use getUserStats since it relies on just a userId
      const stats = await AnalyticsService.getUserStats(id);
      res.json({ data: stats });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async getMemberDashboard(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      // 1. Fetch member profile and verify access
      // Using UserService for consistency and to ensure all fields are included
      const member = await UserService.getProfile(id as string);

      if (!member || (req.user?.role !== 'SUPERADMIN' && member.orgId !== req.user?.orgId)) {
        return res.status(404).json({ error: { message: 'Member not found or access denied' } });
      }

      // 2. Fetch all jobs for stats calculation and display
      const jobs = await prisma.job.findMany({
        where: { userId: id as string },
        orderBy: { boardPosition: 'asc' },
        include: { history: { orderBy: { enteredAt: 'asc' } } }
      });

      // 3. Calculate stats using internal helper (making it semi-public for this call)
      // Since calculateStats is private in AnalyticsService, we'll wrap it or just use AnalyticsService.getUserStats
      // Actually, for maximum speed, we just use the jobs we already fetched.
      // We'll cast to any to call the private static method if needed, or better, just call getUserStats
      // But we want to avoid double fetching.
      const stats = (AnalyticsService as any).calculateStats(jobs);

      res.json({
        data: {
          member,
          stats,
          jobs
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }
}
