import { OrganizationService, UserService } from '../services/user.service.js';
import { organizationSchema } from '../validators/user.validator.js';
export class OrganizationController {
    static async getAll(req, res) {
        try {
            const orgs = await OrganizationService.getAll();
            res.json({ data: orgs });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async create(req, res) {
        try {
            const validatedData = organizationSchema.parse(req.body);
            const org = await OrganizationService.create(validatedData);
            res.status(201).json({ data: org });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
}
export class UserController {
    static async getStudents(req, res) {
        try {
            const orgId = req.user?.orgId;
            if (!orgId && req.user?.role !== 'SUPERADMIN') {
                return res.status(403).json({ error: { message: 'Organization ID missing' } });
            }
            const students = await UserService.getStudentsByOrg(orgId);
            res.json({ data: students });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async getStats(req, res) {
        try {
            const stats = await UserService.getSuperadminStats();
            res.json({ data: stats });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=user.controller.js.map