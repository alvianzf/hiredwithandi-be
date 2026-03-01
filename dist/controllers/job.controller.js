import { JobService } from '../services/job.service.js';
import { jobSchema, updateJobDetailsSchema, updateJobStatusSchema } from '../validators/job.validator.js';
export class JobController {
    static async getAll(req, res) {
        try {
            let targetUserId = req.user.id;
            if (req.query.userId && (req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN')) {
                targetUserId = req.query.userId;
            }
            const jobs = await JobService.getUserJobs(targetUserId);
            res.json({ data: jobs });
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async create(req, res) {
        try {
            const validatedData = jobSchema.parse(req.body);
            const job = await JobService.createJob(req.user.id, validatedData);
            res.status(201).json({ data: job });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async updateStatus(req, res) {
        try {
            const id = req.params['id'];
            const { status, boardPosition } = updateJobStatusSchema.parse(req.body);
            const job = await JobService.updateJobStatus(req.user.id, id, status, boardPosition);
            res.json({ data: job });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async updateDetails(req, res) {
        try {
            const id = req.params['id'];
            const validatedData = updateJobDetailsSchema.parse(req.body);
            const job = await JobService.updateJobDetails(req.user.id, id, validatedData);
            res.json({ data: job });
        }
        catch (error) {
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async delete(req, res) {
        try {
            const id = req.params['id'];
            await JobService.deleteJob(req.user.id, id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=job.controller.js.map