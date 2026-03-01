import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async checkEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    return { exists: !!user };
  }

  static async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        name: data.name,
        role: data.role,
        orgId: data.orgId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        orgId: true,
        createdAt: true
      }
    });
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user || user.status === 'DISABLED') {
      throw new Error('Invalid credentials or account disabled');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, orgId: user.orgId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET! + '_refresh'),
      { expiresIn: '7d' }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId: user.orgId
      }
    };
  }
  static async refresh(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET! + '_refresh')
      ) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user || user.status === 'DISABLED') {
        throw new Error('User not found or disabled');
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, orgId: user.orgId },
        process.env.JWT_SECRET!,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET! + '_refresh'),
        { expiresIn: '7d' }
      );

      return {
        token,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          orgId: user.orgId
        }
      };
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }
}
