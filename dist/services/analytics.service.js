import prisma from '../config/prisma.js';
export class AnalyticsService {
    static async getUserStats(userId) {
        const jobs = await prisma.job.findMany({
            where: { userId },
            include: { history: { orderBy: { enteredAt: 'asc' } } }
        });
        return this.calculateStats(jobs);
    }
    static async getOrgStats(orgId) {
        const students = await prisma.user.findMany({
            where: { orgId, role: 'STUDENT' },
            select: { id: true }
        });
        const userIds = students.map(s => s.id);
        const jobs = await prisma.job.findMany({
            where: { userId: { in: userIds } },
            include: { history: { orderBy: { enteredAt: 'asc' } } }
        });
        const stats = this.calculateStats(jobs);
        return {
            studentCount: userIds.length,
            ...stats
        };
    }
    static calculateStats(jobs) {
        if (jobs.length === 0)
            return this.getEmptyStats();
        const totalJobs = jobs.length;
        const offeredJobs = jobs.filter(j => j.status === 'offered').length;
        const rejectedJobs = jobs.filter(j => j.status === 'rejected_by_company' || j.status === 'rejected_by_applicant').length;
        const formatRate = (count, total) => total > 0 ? (count / total * 100).toFixed(1) + '%' : '0.0%';
        const offerRate = formatRate(offeredJobs, totalJobs);
        const rejectionRate = formatRate(rejectedJobs, totalJobs);
        // Timeline calculations
        const now = new Date().getTime();
        const daysAgo = (date) => {
            if (!date)
                return 'N/A';
            const diff = now - new Date(date).getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            return `${days} days ago`;
        };
        // Avg Days in pipeline
        const getDaysInPipeline = (job) => {
            if (!job.history || job.history.length === 0)
                return 0;
            const start = new Date(job.history[0].enteredAt).getTime();
            const end = job.history[job.history.length - 1].leftAt
                ? new Date(job.history[job.history.length - 1].leftAt).getTime()
                : new Date().getTime();
            return Math.round((end - start) / (1000 * 60 * 60 * 24));
        };
        const avgDaysInPipeline = totalJobs > 0
            ? Math.round(jobs.reduce((acc, j) => acc + getDaysInPipeline(j), 0) / totalJobs)
            : 0;
        // Conversion Funnel
        // Applied: generally anything not in wishlist
        const appliedJobs = jobs.filter(j => j.status !== 'wishlist').length;
        // Interviewed: has current status as interview OR has interview in history
        const interviewedJobs = jobs.filter(j => {
            const interviewStatuses = ['hr_interview', 'technical_interview', 'additional_interview'];
            if (interviewStatuses.includes(j.status))
                return true;
            if (j.history && j.history.some((h) => interviewStatuses.includes(h.status)))
                return true;
            return false;
        }).length;
        // Status Breakdown
        const statuses = [
            { key: 'wishlist', label: 'Wishlist' },
            { key: 'applied', label: 'Applied' },
            { key: 'hr_interview', label: 'HR Interview' },
            { key: 'technical_interview', label: 'Technical Interview' },
            { key: 'additional_interview', label: 'Additional Interview' },
            { key: 'offered', label: 'Offered' },
            { key: 'rejected_by_company', label: 'Rejected by Company' },
            { key: 'rejected_by_applicant', label: 'Rejected by Applicant' }
        ];
        const statusBreakdown = statuses.map(s => {
            const count = jobs.filter(j => j.status === s.key).length;
            return {
                id: s.key,
                name: s.label,
                count,
                percentage: formatRate(count, totalJobs)
            };
        });
        // Work Type Distribution
        const workTypes = [
            { key: 'REMOTE', label: 'Remote', emoji: '🌍' },
            { key: 'ONSITE', label: 'On-site', emoji: '🏢' },
            { key: 'HYBRID', label: 'Hybrid', emoji: '🔄' }
        ];
        const workTypeDistribution = workTypes.map(w => {
            const count = jobs.filter(j => j.workType === w.key).length;
            return {
                id: w.key,
                label: w.label,
                emoji: w.emoji,
                value: `${count} (${formatRate(count, totalJobs)})`
            };
        });
        // Salary Insights
        const parseSalary = (salary) => {
            if (!salary)
                return null;
            // remove commas or dots to parse properly e.g. "Rp 20.000.000" -> "20000000"
            const cleaned = salary.replace(/[,.]/g, '');
            const nums = cleaned.match(/\d+/g);
            return nums && nums.length > 0 ? parseInt(nums.join('')) : null;
        };
        // Very simple formatter depending on magnitude. The user example showed short versions
        // We will use standard formatting since original format might be anything
        const formatIDR = (val) => `Rp ${val.toLocaleString('id-ID')}`;
        const formatUSD = (val) => `$${val.toLocaleString('en-US')}`;
        const idrJobs = jobs.filter(j => j.salary?.toLowerCase().includes('rp') || (!j.salary?.includes('$') && j.salary && /\d/.test(j.salary)));
        const usdJobs = jobs.filter(j => j.salary?.includes('$'));
        const idrSalaries = idrJobs.map(j => parseSalary(j.salary)).filter((s) => s !== null);
        const usdSalaries = usdJobs.map(j => parseSalary(j.salary)).filter((s) => s !== null);
        const getSalaryStats = (salaries, format) => {
            if (salaries.length === 0)
                return { lowest: 'N/A', average: 'N/A', highest: 'N/A' };
            return {
                lowest: format(Math.min(...salaries)),
                average: format(Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length)),
                highest: format(Math.max(...salaries))
            };
        };
        // Job Fit Percentage
        const jfpData = jobs.map(j => j.jobFitPercentage).filter((v) => v !== null);
        const getJfpStats = (data) => {
            if (data.length === 0)
                return { median: 'N/A', average: 'N/A', lowest: 'N/A', highest: 'N/A', basedOn: 0 };
            const sorted = [...data].sort((a, b) => a - b);
            const median = sorted.length % 2 === 0
                ? (sorted[(sorted.length / 2) - 1] + sorted[sorted.length / 2]) / 2
                : sorted[Math.floor(sorted.length / 2)];
            return {
                median: `${Math.round(median)}%`,
                average: `${Math.round(data.reduce((a, b) => a + b, 0) / data.length)}%`,
                lowest: `${Math.round(sorted[0])}%`,
                highest: `${Math.round(sorted[sorted.length - 1])}%`,
                basedOn: data.length
            };
        };
        // Activity Insights
        // Week grouping
        const weeks = {};
        jobs.forEach(j => {
            if (!j.dateApplied)
                return;
            const d = new Date(j.dateApplied);
            // Start of week (Sunday)
            const weekStart = new Date(d);
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const key = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            weeks[key] = (weeks[key] || 0) + 1;
        });
        let mostActiveWeek = 'N/A';
        let maxApps = 0;
        Object.entries(weeks).forEach(([week, apps]) => {
            if (apps > maxApps) {
                maxApps = apps;
                mostActiveWeek = `${week} — ${apps} apps`;
            }
        });
        // Timeline Analytics
        const sortedByDate = [...jobs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        const interviews = jobs.filter(j => ['hr_interview', 'technical_interview', 'additional_interview'].includes(j.status))
            .sort((a, b) => new Date(b.statusChangedAt).getTime() - new Date(a.statusChangedAt).getTime());
        const rejections = jobs.filter(j => j.status.startsWith('rejected'))
            .sort((a, b) => new Date(b.statusChangedAt).getTime() - new Date(a.statusChangedAt).getTime());
        const latest = sortedByDate[sortedByDate.length - 1];
        const getStatusLabel = (key) => statuses.find(s => s.key === key)?.label || key;
        // Average Time per Stage
        const stageTime = {};
        statuses.forEach(s => stageTime[s.key] = { totalDays: 0, count: 0 });
        jobs.forEach(j => {
            j.history?.forEach((h) => {
                if (stageTime[h.status]) {
                    const start = new Date(h.enteredAt).getTime();
                    const end = h.leftAt ? new Date(h.leftAt).getTime() : new Date().getTime();
                    const days = (end - start) / (1000 * 60 * 60 * 24);
                    stageTime[h.status].totalDays += days;
                    stageTime[h.status].count += 1;
                }
            });
        });
        const averageTimePerStage = statuses.map(s => {
            const stats = stageTime[s.key] || { count: 0, totalDays: 0 };
            return {
                id: s.key,
                name: s.label,
                jobsCount: `${stats.count} jobs`,
                averageDays: stats.count > 0 ? `${Math.round(stats.totalDays / stats.count)}d` : '0d'
            };
        });
        return {
            overview: {
                all: totalJobs,
                offered: { count: offeredJobs, rate: offerRate },
                rejected: { count: rejectedJobs, rate: rejectionRate },
                avgDaysInPipeline: `${avgDaysInPipeline} in pipeline`
            },
            conversionFunnel: {
                all: { count: totalJobs, rate: formatRate(totalJobs, totalJobs) },
                applied: { count: appliedJobs, rate: formatRate(appliedJobs, totalJobs) },
                interviewed: { count: interviewedJobs, rate: formatRate(interviewedJobs, totalJobs) },
                offered: { count: offeredJobs, rate: formatRate(offeredJobs, totalJobs) }
            },
            statusBreakdown,
            workTypeDistribution,
            salaryInsights: {
                idr: getSalaryStats(idrSalaries, formatIDR),
                usd: getSalaryStats(usdSalaries, formatUSD)
            },
            jobFitPercentage: getJfpStats(jfpData),
            activityInsights: {
                mostActiveWeek,
                interviewRate: formatRate(interviewedJobs, appliedJobs), // Interviewed out of Applied
                offerRate: formatRate(offeredJobs, interviewedJobs > 0 ? interviewedJobs : appliedJobs > 0 ? appliedJobs : totalJobs) // Offered out of Interviewed
            },
            timelineAnalytics: {
                firstJobTracked: sortedByDate.length > 0 ? daysAgo(sortedByDate[0].createdAt) : 'N/A',
                lastInterview: interviews.length > 0 ? daysAgo(interviews[0].statusChangedAt) : 'N/A',
                lastRejection: rejections.length > 0 ? daysAgo(rejections[0].statusChangedAt) : 'N/A',
                latestApplication: latest ? {
                    company: latest.company,
                    position: latest.position,
                    status: getStatusLabel(latest.status)
                } : null
            },
            averageTimePerStage
        };
    }
    static getEmptyStats() {
        return {
            overview: { all: 0, offered: { count: 0, rate: '0.0%' }, rejected: { count: 0, rate: '0.0%' }, avgDaysInPipeline: '0 in pipeline' },
            conversionFunnel: { all: { count: 0, rate: '0.0%' }, applied: { count: 0, rate: '0.0%' }, interviewed: { count: 0, rate: '0.0%' }, offered: { count: 0, rate: '0.0%' } },
            statusBreakdown: [],
            workTypeDistribution: [],
            salaryInsights: {
                idr: { lowest: 'N/A', average: 'N/A', highest: 'N/A' },
                usd: { lowest: 'N/A', average: 'N/A', highest: 'N/A' }
            },
            jobFitPercentage: { median: 'N/A', average: 'N/A', lowest: 'N/A', highest: 'N/A', basedOn: 0 },
            activityInsights: { mostActiveWeek: 'N/A', interviewRate: '0.0%', offerRate: '0.0%' },
            timelineAnalytics: { firstJobTracked: 'N/A', lastInterview: 'N/A', lastRejection: 'N/A', latestApplication: null },
            averageTimePerStage: []
        };
    }
}
//# sourceMappingURL=analytics.service.js.map