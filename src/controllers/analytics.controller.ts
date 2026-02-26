import { Response } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

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
}
