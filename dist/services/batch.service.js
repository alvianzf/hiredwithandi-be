import prisma from '../config/prisma.js';
export class BatchService {
    static async getByOrgId(orgId) {
        return prisma.batch.findMany({
            where: { orgId },
            include: {
                _count: {
                    select: { users: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    static async create(orgId, data) {
        const existing = await prisma.batch.findUnique({
            where: { name_orgId: { name: data.name, orgId } }
        });
        if (existing) {
            throw new Error(`Batch '${data.name}' already exists in this organization.`);
        }
        return prisma.batch.create({
            data: {
                name: data.name,
                orgId
            }
        });
    }
    static async update(id, data) {
        return prisma.batch.update({
            where: { id },
            data
        });
    }
    static async delete(id) {
        return prisma.batch.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=batch.service.js.map