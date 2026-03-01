export declare class AnalyticsService {
    static getUserStats(userId: string): Promise<{
        overview: {
            all: number;
            offered: {
                count: number;
                rate: string;
            };
            rejected: {
                count: number;
                rate: string;
            };
            avgDaysInPipeline: string;
        };
        conversionFunnel: {
            all: {
                count: number;
                rate: string;
            };
            applied: {
                count: number;
                rate: string;
            };
            interviewed: {
                count: number;
                rate: string;
            };
            offered: {
                count: number;
                rate: string;
            };
        };
        statusBreakdown: {
            id: string;
            name: string;
            count: number;
            percentage: string;
        }[];
        workTypeDistribution: {
            id: string;
            label: string;
            emoji: string;
            value: string;
        }[];
        salaryInsights: {
            idr: {
                lowest: string;
                average: string;
                highest: string;
            };
            usd: {
                lowest: string;
                average: string;
                highest: string;
            };
        };
        jobFitPercentage: {
            median: string;
            average: string;
            lowest: string;
            highest: string;
            basedOn: number;
        };
        activityInsights: {
            mostActiveWeek: string;
            interviewRate: string;
            offerRate: string;
        };
        timelineAnalytics: {
            firstJobTracked: string;
            lastInterview: string;
            lastRejection: string;
            latestApplication: {
                company: any;
                position: any;
                status: string;
            } | null;
        };
        averageTimePerStage: {
            id: string;
            name: string;
            jobsCount: string;
            averageDays: string;
        }[];
    }>;
    static getOrgStats(orgId: string, batchId?: string): Promise<{
        overview: {
            all: number;
            offered: {
                count: number;
                rate: string;
            };
            rejected: {
                count: number;
                rate: string;
            };
            avgDaysInPipeline: string;
        };
        conversionFunnel: {
            all: {
                count: number;
                rate: string;
            };
            applied: {
                count: number;
                rate: string;
            };
            interviewed: {
                count: number;
                rate: string;
            };
            offered: {
                count: number;
                rate: string;
            };
        };
        statusBreakdown: {
            id: string;
            name: string;
            count: number;
            percentage: string;
        }[];
        workTypeDistribution: {
            id: string;
            label: string;
            emoji: string;
            value: string;
        }[];
        salaryInsights: {
            idr: {
                lowest: string;
                average: string;
                highest: string;
            };
            usd: {
                lowest: string;
                average: string;
                highest: string;
            };
        };
        jobFitPercentage: {
            median: string;
            average: string;
            lowest: string;
            highest: string;
            basedOn: number;
        };
        activityInsights: {
            mostActiveWeek: string;
            interviewRate: string;
            offerRate: string;
        };
        timelineAnalytics: {
            firstJobTracked: string;
            lastInterview: string;
            lastRejection: string;
            latestApplication: {
                company: any;
                position: any;
                status: string;
            } | null;
        };
        averageTimePerStage: {
            id: string;
            name: string;
            jobsCount: string;
            averageDays: string;
        }[];
        memberCount: number;
    }>;
    private static calculateStats;
    private static getEmptyStats;
}
