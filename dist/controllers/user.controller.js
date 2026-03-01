import { OrganizationService, UserService } from '../services/user.service.js';
import { organizationSchema, organizationUpdateSchema, profileUpdateSchema, userCreateSchema, userUpdateSchema, batchMemberSchema } from '../validators/user.validator.js';
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
    static async update(req, res) {
        try {
            const validatedData = organizationUpdateSchema.parse(req.body);
            const org = await OrganizationService.update(req.params.id, validatedData);
            res.json({ data: org });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async delete(req, res) {
        try {
            await OrganizationService.delete(req.params.id);
            res.json({ message: 'Organization deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
}
export class UserController {
    static async getMembers(req, res) {
        try {
            const orgId = req.user?.orgId;
            if (!orgId && req.user?.role !== 'SUPERADMIN') {
                return res.status(403).json({ error: { message: 'Organization ID missing' } });
            }
            const batchId = req.query.batchId;
            const members = await UserService.getMembersByOrg(orgId, batchId);
            res.json({ data: members });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async getMemberById(req, res) {
        try {
            const { id } = req.params;
            const member = await UserService.getProfile(id);
            if (!member || (req.user?.role !== 'SUPERADMIN' && member.orgId !== req.user?.orgId)) {
                return res.status(404).json({ error: { message: 'Member not found or access denied' } });
            }
            res.json({ data: member });
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
    static async getProfile(req, res) {
        try {
            const profile = await UserService.getProfile(req.user.id);
            res.json({ data: profile });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async updateProfile(req, res) {
        try {
            const validatedData = profileUpdateSchema.parse(req.body);
            const file = req.file;
            const profile = await UserService.updateProfile(req.user.id, validatedData, file);
            res.json({ data: profile });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAll();
            res.json({ data: users });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async createUser(req, res) {
        try {
            const validatedData = userCreateSchema.parse(req.body);
            const user = await UserService.createUser(validatedData);
            res.status(201).json({ data: user });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async updateUser(req, res) {
        try {
            const validatedData = userUpdateSchema.parse(req.body);
            const user = await UserService.updateUser(req.params.id, validatedData);
            res.json({ data: user });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async batchCreateMembers(req, res) {
        try {
            const orgId = req.user?.orgId;
            if (!orgId && req.user?.role !== 'SUPERADMIN') {
                return res.status(403).json({ error: { message: 'Organization ID missing' } });
            }
            const targetOrgId = req.body.orgId || orgId;
            if (!targetOrgId) {
                return res.status(400).json({ error: { message: 'orgId is required' } });
            }
            const validatedData = batchMemberSchema.parse(req.body.members);
            const result = await UserService.batchCreateMembers(targetOrgId, validatedData);
            res.status(201).json({ data: result });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=user.controller.js.map