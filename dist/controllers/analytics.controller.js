import { AnalyticsService } from '../services/analytics.service.js';
import { UserService } from '../services/user.service.js';
import prisma from '../config/prisma.js';
export class AnalyticsController {
    static async getUserStats(req, res) {
        try {
            const stats = await AnalyticsService.getUserStats(req.user.id);
            res.json({ data: stats });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async getOrgStats(req, res) {
        try {
            const id = req.params['id'];
            const stats = await AnalyticsService.getOrgStats(id);
            res.json({ data: stats });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async getStudentStats(req, res) {
        try {
            const id = req.params['id'];
            // Re-use getUserStats since it relies on just a userId
            const stats = await AnalyticsService.getUserStats(id);
            res.json({ data: stats });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async getStudentDashboard(req, res) {
        try {
            const { id } = req.params;
            console.log(`DASHBOARD_HIT: ${id}`);
            // 1. Fetch student profile and verify access
            // Using UserService for consistency and to ensure all fields are included
            const student = await UserService.getProfile(id);
            if (!student || (req.user?.role !== 'SUPERADMIN' && student.orgId !== req.user?.orgId)) {
                return res.status(404).json({ error: { message: 'Student not found or access denied' } });
            }
            // 2. Fetch all jobs for stats calculation and display
            const jobs = await prisma.job.findMany({
                where: { userId: id },
                orderBy: { boardPosition: 'asc' },
                include: { history: { orderBy: { enteredAt: 'asc' } } }
            });
            // 3. Calculate stats using internal helper (making it semi-public for this call)
            // Since calculateStats is private in AnalyticsService, we'll wrap it or just use AnalyticsService.getUserStats
            // Actually, for maximum speed, we just use the jobs we already fetched.
            // We'll cast to any to call the private static method if needed, or better, just call getUserStats
            // But we want to avoid double fetching.
            const stats = AnalyticsService.calculateStats(jobs);
            res.json({
                data: {
                    student,
                    stats,
                    jobs
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=analytics.controller.js.map