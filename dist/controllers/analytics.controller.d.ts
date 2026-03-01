import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class AnalyticsController {
    static getUserStats(req: AuthRequest, res: Response): Promise<void>;
    static getOrgStats(req: AuthRequest, res: Response): Promise<void>;
    static getStudentStats(req: AuthRequest, res: Response): Promise<void>;
    static getStudentDashboard(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
