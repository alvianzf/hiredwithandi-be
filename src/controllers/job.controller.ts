import { Response } from 'express';
import { JobService } from '../services/job.service.js';
import { jobSchema, updateJobDetailsSchema, updateJobStatusSchema } from '../validators/job.validator.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class JobController {
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const jobs = await JobService.getUserJobs(req.user!.id);
      res.json({ data: jobs });
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const validatedData = jobSchema.parse(req.body);
      const job = await JobService.createJob(req.user!.id, validatedData);
      res.status(201).json({ data: job });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response) {
    try {
      const id = req.params['id'] as string;
      const { status, boardPosition } = updateJobStatusSchema.parse(req.body);
      const job = await JobService.updateJobStatus(req.user!.id, id, status, boardPosition);
      res.json({ data: job });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async updateDetails(req: AuthRequest, res: Response) {
    try {
      const id = req.params['id'] as string;
      const validatedData = updateJobDetailsSchema.parse(req.body);
      const job = await JobService.updateJobDetails(req.user!.id, id, validatedData);
      res.json({ data: job });
    } catch (error: any) {
      res.status(400).json({ error: { message: error.message } });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const id = req.params['id'] as string;
      await JobService.deleteJob(req.user!.id, id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: { message: error.message } });
    }
  }
}
