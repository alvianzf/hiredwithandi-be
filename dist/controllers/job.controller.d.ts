import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class JobController {
    static getAll(req: AuthRequest, res: Response): Promise<void>;
    static create(req: AuthRequest, res: Response): Promise<void>;
    static updateStatus(req: AuthRequest, res: Response): Promise<void>;
    static updateDetails(req: AuthRequest, res: Response): Promise<void>;
    static delete(req: AuthRequest, res: Response): Promise<void>;
}
