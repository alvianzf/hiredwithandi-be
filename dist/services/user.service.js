import prisma from '../config/prisma.js';
import fs from 'fs/promises';
import path from 'path';
async function deleteAvatarFile(avatarUrl) {
    if (!avatarUrl || !avatarUrl.startsWith('/uploads/avatars/'))
        return;
    try {
        const absolutePath = path.join(process.cwd(), 'public', avatarUrl);
        await fs.unlink(absolutePath);
    }
    catch (error) {
        // Ignore ENOENT errors (file already deleted) or log others silently
        console.error('Failed to delete avatar file:', error);
    }
}
export class OrganizationService {
    static async getAll() {
        return prisma.organization.findMany({
            include: {
                _count: {
                    select: { users: { where: { role: 'MEMBER' } } }
                }
            }
        });
    }
    static async create(data) {
        const existing = await prisma.organization.findUnique({ where: { name: data.name } });
        if (existing) {
            throw new Error(`Organization '${data.name}' already exists.`);
        }
        return prisma.organization.create({ data });
    }
    static async getById(id) {
        return prisma.organization.findUnique({
            where: { id },
            include: { users: true }
        });
    }
    static async update(id, data) {
        return prisma.$transaction(async (tx) => {
            const org = await tx.organization.update({
                where: { id },
                data
            });
            // Cascade status change to all users in the organization
            if (data.status) {
                await tx.user.updateMany({
                    where: { orgId: id },
                    data: { status: data.status }
                });
            }
            return org;
        });
    }
    static async delete(id) {
        // Before deleting the org, clean up physical avatars of all users in it
        const users = await prisma.user.findMany({
            where: { orgId: id },
            select: { avatarUrl: true }
        });
        for (const user of users) {
            if (user.avatarUrl) {
                await deleteAvatarFile(user.avatarUrl);
            }
        }
        return prisma.organization.delete({
            where: { id }
        });
    }
}
export class UserService {
    static async getMembersByOrg(orgId, params = {}) {
        const { batchId, page = 1, limit = 10, search, status } = params;
        const whereClause = { orgId, role: 'MEMBER' };
        if (batchId && batchId !== 'All' && batchId !== '') {
            whereClause.batchId = batchId;
        }
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status && status !== 'All') {
            whereClause.status = status.toUpperCase();
        }
        const skip = (page - 1) * limit;
        const [members, total] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    status: true,
                    lastLogin: true,
                    createdAt: true,
                    batch: { select: { id: true, name: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where: whereClause })
        ]);
        return { members, total };
    }
    static async getSuperadminStats() {
        const [totalOrganizations, activeOrganizations, totalAdmins, totalMembers, totalPlatformUsers] = await Promise.all([
            prisma.organization.count({ where: { isTest: false } }),
            prisma.organization.count({ where: { status: 'ACTIVE', isTest: false } }),
            prisma.user.count({ where: { role: 'ADMIN', isTest: false } }),
            prisma.user.count({ where: { role: 'MEMBER', isTest: false } }),
            prisma.user.count({ where: { isTest: false } }),
        ]);
        return {
            totalOrganizations,
            activeOrganizations,
            totalAdmins,
            totalMembers,
            totalPlatformUsers
        };
    }
    static async getProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                orgId: true,
                batchId: true,
                bio: true,
                location: true,
                linkedIn: true,
                avatarUrl: true,
                createdAt: true,
                organization: {
                    select: { name: true }
                },
                batch: {
                    select: { id: true, name: true }
                }
            }
        });
        if (!user)
            return null;
        return {
            ...user,
            organization: user.organization?.name || ''
        };
    }
    static async updateProfile(userId, data, file) {
        let updateData = { ...data };
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarUrl: true }
        });
        // If a file is provided via multipart/form-data, save to local disk
        if (file) {
            try {
                const fs = await import('fs/promises');
                const path = await import('path');
                // Extract extension from mimetype (e.g. image/jpeg -> jpeg)
                const extension = file.mimetype.split('/')[1] || 'jpg';
                const fileName = `${userId}-${Date.now()}.${extension}`;
                const relativePath = `uploads/avatars/${fileName}`;
                const absolutePath = path.join(process.cwd(), 'public', relativePath);
                // Ensure the directory exists
                const dir = path.dirname(absolutePath);
                await fs.mkdir(dir, { recursive: true });
                // Save the buffer to disk
                await fs.writeFile(absolutePath, file.buffer);
                updateData.avatarUrl = `/${relativePath}`;
                // Cleanup old local avatar if one existed
                if (existingUser?.avatarUrl) {
                    await deleteAvatarFile(existingUser.avatarUrl);
                }
            }
            catch (error) {
                throw new Error(`Profile photo upload failed: ${error.message}`);
            }
        }
        else if (data.avatarUrl === null || data.avatarUrl === 'null' || data.avatarUrl === '') {
            // Allow clearing the avatar explicitly
            updateData.avatarUrl = null;
            if (existingUser?.avatarUrl) {
                await deleteAvatarFile(existingUser.avatarUrl);
            }
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                bio: true,
                location: true,
                linkedIn: true,
                avatarUrl: true,
                organization: {
                    select: { name: true }
                }
            }
        });
        return {
            ...user,
            organization: user.organization?.name || ''
        };
    }
    static async getAll(params = {}) {
        const { page = 1, limit = 10, search, role, orgId, batchId, status } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (role && role !== 'All') {
            where.role = role === 'Superadmin' ? 'SUPERADMIN' : role === 'Org Admin' ? 'ADMIN' : 'MEMBER';
        }
        if (orgId && orgId !== 'All') {
            if (orgId === 'sys') {
                where.role = 'SUPERADMIN';
            }
            else {
                where.orgId = orgId;
            }
        }
        if (status && status !== 'All') {
            where.status = status.toUpperCase();
        }
        if (batchId && batchId !== 'All') {
            where.batchId = batchId;
        }
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    organization: {
                        select: { name: true }
                    },
                    batch: {
                        select: { id: true, name: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);
        return { users, total };
    }
    static async createUser(data) {
        return prisma.user.create({
            data: {
                name: data.name || data.email.split('@')[0],
                email: data.email,
                role: data.role,
                orgId: data.orgId,
                batchId: data.batchId,
                status: data.status,
            }
        });
    }
    static async updateUser(id, data) {
        return prisma.user.update({
            where: { id },
            data
        });
    }
    static async batchCreateMembers(orgId, members) {
        const records = members.map(s => ({
            name: s.name || s.email.split('@')[0],
            email: s.email,
            orgId,
            batchId: s.batchId || null,
            role: 'MEMBER',
            status: 'ACTIVE',
        }));
        return prisma.user.createMany({
            data: records,
            skipDuplicates: true // Skip if email already exists
        });
    }
}
//# sourceMappingURL=user.service.js.map