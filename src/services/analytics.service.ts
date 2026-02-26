import prisma from '../config/prisma.js';

export class AnalyticsService {
  static async getUserStats(userId: string) {
    const jobs = await prisma.job.findMany({
      where: { userId },
      include: { history: true }
    });

    if (jobs.length === 0) return this.getEmptyStats();

    // 1. Basic Counts
    const totalJobs = jobs.length;
    const offeredJobs = jobs.filter(j => j.status === 'offered').length;
    const rejectedJobs = jobs.filter(j =>
      j.status === 'rejected_by_company' || j.status === 'rejected_by_applicant'
    ).length;

    // 2. Rates
    const offerRate = (offeredJobs / totalJobs) * 100;
    const rejectionRate = (rejectedJobs / totalJobs) * 100;

    // 3. Status Breakdown & Funnel
    const statusCounts: Record<string, number> = {};
    jobs.forEach(j => {
      statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
    });

    const interviewedCount = jobs.filter(j =>
      ['hr_interview', 'technical_interview', 'additional_interview'].includes(j.status)
    ).length;

    // 4. Work Type Distribution
    const workTypeDist = {
      REMOTE: jobs.filter(j => j.workType === 'REMOTE').length,
      ONSITE: jobs.filter(j => j.workType === 'ONSITE').length,
      HYBRID: jobs.filter(j => j.workType === 'HYBRID').length,
    };

    // 5. Salary & JFP Insights
    const parseSalary = (salary: string | null): number | null => {
      if (!salary) return null;
      const nums = salary.match(/\d+/g);
      return nums ? parseInt(nums[0]) : null;
    };

    const getMinAvgMax = (data: number[]) => {
      if (data.length === 0) return { min: 0, avg: 0, max: 0 };
      const sum = data.reduce((a, b) => a + b, 0);
      return {
        min: Math.min(...data),
        avg: Math.round(sum / data.length),
        max: Math.max(...data)
      };
    };

    const idrSalaries = jobs
      .filter(j => j.salary?.includes('Rp') || (!j.salary?.includes('$') && j.salary))
      .map(j => parseSalary(j.salary))
      .filter((s): s is number => s !== null);

    const usdSalaries = jobs
      .filter(j => j.salary?.includes('$'))
      .map(j => parseSalary(j.salary))
      .filter((s): s is number => s !== null);

    const jfpData = jobs
      .map(j => j.jobFitPercentage)
      .filter((v): v is number => v !== null);

    // 6. Timeline & Time per Stage
    // Average Days in Pipeline (Average time from Wishlist/Applied to Offer/Rejected)
    // For simplicity, using first and last history entry timestamps
    const getDaysInPipeline = (job: any) => {
      if (!job.history || job.history.length < 2) return 0;
      const start = new Date(job.history[0].enteredAt).getTime();
      const end = job.history[job.history.length - 1].leftAt
        ? new Date(job.history[job.history.length - 1].leftAt).getTime()
        : new Date().getTime();
      return Math.round((end - start) / (1000 * 60 * 60 * 24));
    };

    const avgDaysInPipeline = Math.round(
      jobs.reduce((acc, j) => acc + getDaysInPipeline(j), 0) / totalJobs
    );

    return {
      all: totalJobs,
      offered: { count: offeredJobs, rate: offerRate.toFixed(1) + '%' },
      rejected: { count: rejectedJobs, rate: rejectionRate.toFixed(1) + '%' },
      avgDaysInPipeline,
      conversionFunnel: {
        all: totalJobs,
        applied: totalJobs - (statusCounts['wishlist'] || 0),
        interviewed: interviewedCount,
        offered: offeredJobs
      },
      statusBreakdown: statusCounts,
      workTypeDistribution: workTypeDist,
      salaryInsights: {
        idr: getMinAvgMax(idrSalaries),
        usd: getMinAvgMax(usdSalaries)
      },
      jfp: {
        ...getMinAvgMax(jfpData),
        median: this.getMedian(jfpData),
        count: jfpData.length
      },
      timeline: {
        firstJobTracked: jobs[0]?.createdAt,
        lastInterview: jobs.filter(j => j.status.includes('interview'))
          .sort((a, b) => new Date(b.statusChangedAt).getTime() - new Date(a.statusChangedAt).getTime())[0]?.statusChangedAt,
        latestApplication: jobs[jobs.length - 1]
      }
    };
  }

  static async getOrgStats(orgId: string) {
    const students = await prisma.user.findMany({
      where: { orgId, role: 'STUDENT' },
      select: { id: true }
    });

    const userIds = students.map(s => s.id);
    const jobs = await prisma.job.findMany({
      where: { userId: { in: userIds } },
      include: { history: true }
    });

    // Similar aggregation as getUserStats but for the whole organization
    return {
      studentCount: userIds.length,
      totalJobs: jobs.length,
      // ... further aggregation can be added here
    };
  }

  private static getMedian(values: number[]) {
    if (values.length === 0) return 0;
    values.sort((a, b) => a - b);
    const half = Math.floor(values.length / 2);
    if (values.length % 2) return values[half];
    return (values[half - 1] + values[half]) / 2.0;
  }

  private static getEmptyStats() {
    return { all: 0, offered: 0, rejected: 0 };
  }
}
