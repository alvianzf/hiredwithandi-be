import { AnalyticsService } from '../services/analytics.service.js';
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
}
//# sourceMappingURL=analytics.controller.js.map