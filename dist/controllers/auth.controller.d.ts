import { Request, Response } from 'express';
export declare class AuthController {
    static checkEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
