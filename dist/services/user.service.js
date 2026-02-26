import prisma from '../config/prisma.js';
import cloudinary from '../config/cloudinary.js';
export class OrganizationService {
    static async getAll() {
        return prisma.organization.findMany({
            include: {
                _count: {
                    select: { users: { where: { role: 'STUDENT' } } }
                }
            }
        });
    }
    static async create(data) {
        return prisma.organization.create({ data });
    }
    static async getById(id) {
        return prisma.organization.findUnique({
            where: { id },
            include: { users: true }
        });
    }
}
export class UserService {
    static async getStudentsByOrg(orgId) {
        return prisma.user.findMany({
            where: { orgId, role: 'STUDENT' },
            select: {
                id: true,
                email: true,
                name: true,
                status: true,
                createdAt: true
            }
        });
    }
    static async getSuperadminStats() {
        const orgCount = await prisma.organization.count();
        const userCount = await prisma.user.count({ where: { role: 'STUDENT' } });
        return { totalOrganizations: orgCount, totalStudents: userCount };
    }
    static async getProfile(userId) {
        return prisma.user.findUnique({
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
                createdAt: true
            }
        });
    }
    static async updateProfile(userId, data) {
        let updateData = { ...data };
        // If avatarUrl is a Base64 string, upload to Cloudinary
        if (data.avatarUrl && data.avatarUrl.startsWith('data:image')) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(data.avatarUrl, {
                    folder: 'hwa_profiles',
                    resource_type: 'image'
                });
                updateData.avatarUrl = uploadResponse.secure_url;
            }
            catch (error) {
                throw new Error(`Profile photo upload failed: ${error.message}`);
            }
        }
        return prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                bio: true,
                location: true,
                linkedIn: true,
                avatarUrl: true
            }
        });
    }
}
//# sourceMappingURL=user.service.js.map