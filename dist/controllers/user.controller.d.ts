import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
export declare class OrganizationController {
    static getAll(req: Request, res: Response): Promise<void>;
    static create(req: Request, res: Response): Promise<void>;
    static update(req: Request, res: Response): Promise<void>;
}
export declare class UserController {
    static getStudents(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getStats(req: Request, res: Response): Promise<void>;
    static getProfile(req: AuthRequest, res: Response): Promise<void>;
    static updateProfile(req: AuthRequest, res: Response): Promise<void>;
    static getAllUsers(req: Request, res: Response): Promise<void>;
    static createUser(req: Request, res: Response): Promise<void>;
    static updateUser(req: Request, res: Response): Promise<void>;
    static batchCreateStudents(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
