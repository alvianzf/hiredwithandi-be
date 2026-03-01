import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class AnalyticsController {
    static getUserStats(req: AuthRequest, res: Response): Promise<void>;
    static getOrgStats(req: AuthRequest, res: Response): Promise<void>;
    static getMemberStats(req: AuthRequest, res: Response): Promise<void>;
    static getMemberDashboard(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
