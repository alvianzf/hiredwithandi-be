import prisma from '../config/prisma.js';

export class JobService {
  static async getUserJobs(userId: string) {
    return prisma.job.findMany({
      where: { userId },
      orderBy: { boardPosition: 'asc' },
      include: { history: true }
    });
  }

  static async createJob(userId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      // Create job
      const job = await tx.job.create({
        data: {
          ...data,
          userId,
          statusChangedAt: new Date(),
        }
      });

      // Create initial history entry
      await tx.jobHistory.create({
        data: {
          jobId: job.id,
          status: job.status,
          enteredAt: new Date(),
        }
      });

      return job;
    });
  }

  static async updateJobStatus(userId: string, jobId: string, status: string, boardPosition?: number) {
    return prisma.$transaction(async (tx) => {
      const currentJob = await tx.job.findUnique({
        where: { id: jobId, userId }
      });

      if (!currentJob) throw new Error('Job not found');

      if (currentJob.status !== status) {
        // Update old history entry
        await tx.jobHistory.updateMany({
          where: { jobId, status: currentJob.status, leftAt: null },
          data: { leftAt: new Date() }
        });

        // Create new history entry
        await tx.jobHistory.create({
          data: {
            jobId,
            status,
            enteredAt: new Date()
          }
        });
      }

      return tx.job.update({
        where: { id: jobId },
        data: {
          status,
          boardPosition: boardPosition ?? currentJob.boardPosition,
          statusChangedAt: currentJob.status !== status ? new Date() : currentJob.statusChangedAt
        }
      });
    });
  }

  static async updateJobDetails(userId: string, jobId: string, data: any) {
    return prisma.job.update({
      where: { id: jobId, userId },
      data
    });
  }

  static async deleteJob(userId: string, jobId: string) {
    return prisma.job.delete({
      where: { id: jobId, userId }
    });
  }
}
