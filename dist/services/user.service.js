import prisma from '../config/prisma.js';
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
        return prisma.organization.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        return prisma.organization.delete({
            where: { id }
        });
    }
}
export class UserService {
    static async getMembersByOrg(orgId) {
        return prisma.user.findMany({
            where: { orgId, role: 'MEMBER' },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                lastLogin: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async getSuperadminStats() {
        const orgCount = await prisma.organization.count();
        const userCount = await prisma.user.count({ where: { role: 'MEMBER' } });
        return { totalOrganizations: orgCount, totalMembers: userCount };
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
                bio: true,
                location: true,
                linkedIn: true,
                avatarUrl: true,
                createdAt: true,
                organization: {
                    select: { name: true }
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
            }
            catch (error) {
                throw new Error(`Profile photo upload failed: ${error.message}`);
            }
        }
        else if (data.avatarUrl === null) {
            // Allow clearing the avatar explicitly
            updateData.avatarUrl = null;
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
    static async getAll() {
        return prisma.user.findMany({
            include: {
                organization: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async createUser(data) {
        return prisma.user.create({
            data: {
                name: data.name || data.email.split('@')[0],
                email: data.email,
                role: data.role,
                orgId: data.orgId,
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