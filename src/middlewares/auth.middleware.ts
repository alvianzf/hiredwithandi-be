import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    orgId?: string | null;
    status?: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: { message: 'Authentication required' } });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;

    // For MEMBER: validate session token to enforce single concurrent login
    if (decoded.role === 'MEMBER' && decoded.sessionToken) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { sessionToken: true }
      });
      if (!user || user.sessionToken !== decoded.sessionToken) {
        return res.status(401).json({
          error: {
            message: 'Your account has been signed in from another device. Please log in again.',
            code: 'SESSION_INVALIDATED'
          }
        });
      }
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Permission denied' } });
    }
    next();
  };
};
