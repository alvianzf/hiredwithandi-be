export declare class AnalyticsService {
    static getUserStats(userId: string): Promise<{
        all: number;
        offered: number;
        rejected: number;
    } | {
        all: number;
        offered: {
            count: number;
            rate: string;
        };
        rejected: {
            count: number;
            rate: string;
        };
        avgDaysInPipeline: number;
        conversionFunnel: {
            all: number;
            applied: number;
            interviewed: number;
            offered: number;
        };
        statusBreakdown: Record<string, number>;
        workTypeDistribution: {
            REMOTE: number;
            ONSITE: number;
            HYBRID: number;
        };
        salaryInsights: {
            idr: {
                min: number;
                avg: number;
                max: number;
            };
            usd: {
                min: number;
                avg: number;
                max: number;
            };
        };
        jfp: {
            median: number;
            count: number;
            min: number;
            avg: number;
            max: number;
        };
        timeline: {
            firstJobTracked: Date;
            lastInterview: Date;
            latestApplication: {
                history: {
                    id: string;
                    status: string;
                    jobId: string;
                    enteredAt: Date;
                    leftAt: Date | null;
                }[];
            } & {
                id: string;
                status: string;
                location: string | null;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                company: string;
                position: string;
                url: string | null;
                salary: string | null;
                notes: string | null;
                workType: import(".prisma/client").$Enums.WorkType;
                finalOffer: string | null;
                benefits: string | null;
                nonMonetaryBenefits: string | null;
                jobFitPercentage: number;
                dateApplied: Date;
                statusChangedAt: Date;
                boardPosition: number;
            };
        };
    }>;
    static getOrgStats(orgId: string): Promise<{
        studentCount: number;
        totalJobs: number;
    }>;
    private static getMedian;
    private static getEmptyStats;
}
