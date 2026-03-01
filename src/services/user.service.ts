import prisma from '../config/prisma.js';
import cloudinary from '../config/cloudinary.js';
import bcrypt from 'bcryptjs';

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

  static async create(data: { name: string }) {
    const existing = await prisma.organization.findUnique({ where: { name: data.name } });
    if (existing) {
      throw new Error(`Organization '${data.name}' already exists.`);
    }
    return prisma.organization.create({ data });
  }

  static async getById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: { users: true }
    });
  }

  static async update(id: string, data: { name?: string; status?: 'ACTIVE' | 'DISABLED' }) {
    return prisma.organization.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    return prisma.organization.delete({
      where: { id }
    });
  }
}

export class UserService {
  static async getStudentsByOrg(orgId: string) {
    return prisma.user.findMany({
      where: { orgId, role: 'STUDENT' },
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
    const userCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    return { totalOrganizations: orgCount, totalStudents: userCount };
  }

  static async getProfile(userId: string) {
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

  static async updateProfile(userId: string, data: any) {
    let updateData = { ...data };

    // If avatarUrl is a Base64 string, upload to Cloudinary
    if (data.avatarUrl && data.avatarUrl.startsWith('data:image')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(data.avatarUrl, {
          folder: 'hwa_profiles',
          resource_type: 'image'
        });
        updateData.avatarUrl = uploadResponse.secure_url;
      } catch (error: any) {
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

  static async createUser(data: any) {
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

  static async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  static async batchCreateStudents(orgId: string, students: { name?: string; email: string; }[]) {
    const records = students.map(s => ({
      name: s.name || s.email.split('@')[0],
      email: s.email,
      orgId,
      role: 'STUDENT' as const,
      status: 'ACTIVE' as const,
    }));

    return prisma.user.createMany({
      data: records,
      skipDuplicates: true // Skip if email already exists
    });
  }
}
