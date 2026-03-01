import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  static async checkEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    return {
      exists: !!user,
      hasPassword: !!user?.passwordHash
    };
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

  static async setupPassword(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user || user.status === 'DISABLED') {
      throw new Error('User not found or disabled');
    }

    if (user.passwordHash) {
      throw new Error('User already has a password');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword }
    });

    // Auto-login after generating password
    return this.login(data);
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user || user.status === 'DISABLED') {
      throw new Error('Invalid credentials or account disabled');
    }

    if (!user.passwordHash) {
      throw new Error('Account has no password. Please set one up first.');
    }

    // Role-based login constraints
    // If logging into job-tracker (determined contextually or by a flag), block org admins unless they are assigned
    if (data.app === 'job-tracker' && user.role === 'ADMIN') {
      throw new Error('Organization Admins cannot log into the applicant tracker directly.');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

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

  static async changePassword(userId: string, data: any) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || user.status === 'DISABLED') {
      throw new Error('User not found or disabled');
    }

    if (!user.passwordHash) {
      throw new Error('Account has no password. Please set one up first.');
    }

    const isMatch = await bcrypt.compare(data.currentPassword, user.passwordHash);

    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword }
    });

    return { message: 'Password changed successfully' };
  }
}
