import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
export class AuthService {
    static async checkEmail(email) {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return {
            exists: !!user,
            hasPassword: !!user?.passwordHash
        };
    }
    static async register(data) {
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
    static async setupPassword(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new Error('User not found');
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
    static async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
            include: { organization: { select: { name: true, status: true } } }
        });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (!user.passwordHash) {
            throw new Error('Account has no password. Please set one up first.');
        }
        // Role-based login constraints
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
        // Compute disabled: user is disabled OR their org is disabled
        const isDisabled = user.status === 'DISABLED' || user.organization?.status === 'DISABLED';
        // For MEMBER: generate unique session token (single concurrent login)
        let sessionToken;
        if (user.role === 'MEMBER') {
            sessionToken = crypto.randomUUID();
            await prisma.user.update({
                where: { id: user.id },
                data: { sessionToken }
            });
        }
        const token = jwt.sign({ id: user.id, role: user.role, orgId: user.orgId, status: user.status, ...(sessionToken ? { sessionToken } : {}) }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: user.id, ...(sessionToken ? { sessionToken } : {}) }, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh'), { expiresIn: '7d' });
        return {
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
                isDisabled,
                orgId: user.orgId,
                organization: user.organization?.name || null
            }
        };
    }
    static async refresh(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh'));
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: { organization: { select: { name: true, status: true } } }
            });
            if (!user) {
                throw new Error('User not found');
            }
            // For MEMBER: validate session token matches (single concurrent login)
            if (user.role === 'MEMBER' && decoded.sessionToken && user.sessionToken !== decoded.sessionToken) {
                throw new Error('SESSION_INVALIDATED');
            }
            const isDisabled = user.status === 'DISABLED' || user.organization?.status === 'DISABLED';
            const token = jwt.sign({ id: user.id, role: user.role, orgId: user.orgId, status: user.status, ...(user.sessionToken ? { sessionToken: user.sessionToken } : {}) }, process.env.JWT_SECRET, { expiresIn: '1d' });
            const newRefreshToken = jwt.sign({ id: user.id, ...(user.sessionToken ? { sessionToken: user.sessionToken } : {}) }, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + '_refresh'), { expiresIn: '7d' });
            return {
                token,
                refreshToken: newRefreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    isDisabled,
                    orgId: user.orgId,
                    organization: user.organization?.name || null
                }
            };
        }
        catch (e) {
            if (e.message === 'SESSION_INVALIDATED') {
                throw e;
            }
            throw new Error('Invalid refresh token');
        }
    }
    static async changePassword(userId, data) {
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
    static async resetPassword(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: null, sessionToken: null }
        });
        return { message: 'Password reset successfully. User must set up a new password on next login.' };
    }
}
//# sourceMappingURL=auth.service.js.map