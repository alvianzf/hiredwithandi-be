export declare class OrganizationService {
    static getAll(): Promise<({
        _count: {
            users: number;
        };
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.OrganizationStatus;
        isTest: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    static create(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.OrganizationStatus;
        isTest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getById(id: string): Promise<({
        users: {
            id: string;
            email: string;
            passwordHash: string | null;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            isTest: boolean;
            orgId: string | null;
            batchId: string | null;
            bio: string | null;
            location: string | null;
            linkedIn: string | null;
            avatarUrl: string | null;
            sessionToken: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastLogin: Date | null;
        }[];
    } & {
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.OrganizationStatus;
        isTest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    static update(id: string, data: {
        name?: string;
        status?: 'ACTIVE' | 'DISABLED';
    }): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.OrganizationStatus;
        isTest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static delete(id: string): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.OrganizationStatus;
        isTest: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare class UserService {
    static getMembersByOrg(orgId: string, params?: {
        batchId?: string;
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<{
        members: {
            id: string;
            email: string;
            name: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
            lastLogin: Date | null;
            batch: {
                id: string;
                name: string;
            } | null;
        }[];
        total: number;
    }>;
    static getSuperadminStats(): Promise<{
        totalOrganizations: number;
        activeOrganizations: number;
        totalAdmins: number;
        totalMembers: number;
        totalPlatformUsers: number;
    }>;
    static getProfile(userId: string): Promise<{
        organization: string;
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        orgId: string | null;
        batchId: string | null;
        bio: string | null;
        location: string | null;
        linkedIn: string | null;
        avatarUrl: string | null;
        createdAt: Date;
        batch: {
            id: string;
            name: string;
        } | null;
    } | null>;
    static updateProfile(userId: string, data: any, file?: Express.Multer.File): Promise<{
        organization: string;
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        bio: string | null;
        location: string | null;
        linkedIn: string | null;
        avatarUrl: string | null;
    }>;
    static getAll(params?: {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        orgId?: string;
        batchId?: string;
        status?: string;
    }): Promise<{
        users: ({
            organization: {
                name: string;
            } | null;
            batch: {
                id: string;
                name: string;
            } | null;
        } & {
            id: string;
            email: string;
            passwordHash: string | null;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            isTest: boolean;
            orgId: string | null;
            batchId: string | null;
            bio: string | null;
            location: string | null;
            linkedIn: string | null;
            avatarUrl: string | null;
            sessionToken: string | null;
            createdAt: Date;
            updatedAt: Date;
            lastLogin: Date | null;
        })[];
        total: number;
    }>;
    static createUser(data: any): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        isTest: boolean;
        orgId: string | null;
        batchId: string | null;
        bio: string | null;
        location: string | null;
        linkedIn: string | null;
        avatarUrl: string | null;
        sessionToken: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | null;
    }>;
    static updateUser(id: string, data: any): Promise<{
        id: string;
        email: string;
        passwordHash: string | null;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        isTest: boolean;
        orgId: string | null;
        batchId: string | null;
        bio: string | null;
        location: string | null;
        linkedIn: string | null;
        avatarUrl: string | null;
        sessionToken: string | null;
        createdAt: Date;
        updatedAt: Date;
        lastLogin: Date | null;
    }>;
    static batchCreateMembers(orgId: string, members: {
        name?: string;
        email: string;
        batchId?: string | null;
    }[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
