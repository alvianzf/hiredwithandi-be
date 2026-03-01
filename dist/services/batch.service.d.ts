export declare class BatchService {
    static getByOrgId(orgId: string): Promise<({
        _count: {
            users: number;
        };
    } & {
        id: string;
        name: string;
        orgId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    static create(orgId: string, data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        orgId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static update(id: string, data: {
        name?: string;
    }): Promise<{
        id: string;
        name: string;
        orgId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static delete(id: string): Promise<{
        id: string;
        name: string;
        orgId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
