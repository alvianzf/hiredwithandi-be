import prisma from '../config/prisma.js';

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
    return prisma.organization.create({ data });
  }

  static async getById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
      include: { users: true }
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
        createdAt: true
      }
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
    return prisma.user.update({
      where: { id: userId },
      data,
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
