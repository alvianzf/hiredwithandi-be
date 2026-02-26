export declare class OrganizationService {
    static getAll(): Promise<({
        _count: {
            users: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    static create(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getById(id: string): Promise<({
        users: {
            id: string;
            email: string;
            passwordHash: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            orgId: string | null;
            bio: string | null;
            location: string | null;
            linkedIn: string | null;
            avatarUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
}
export declare class UserService {
    static getStudentsByOrg(orgId: string): Promise<{
        id: string;
        email: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }[]>;
    static getSuperadminStats(): Promise<{
        totalOrganizations: number;
        totalStudents: number;
    }>;
    static getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        orgId: string | null;
        bio: string | null;
        location: string | null;
        linkedIn: string | null;
        avatarUrl: string | null;
        createdAt: Date;
    } | null>;
    static updateProfile(userId: string, data: any): Promise<{
        id: string;
        email: string;
        name: string;
        bio: string | null;
        location: string | null;
        linkedIn: string | null;
        avatarUrl: string | null;
    }>;
}
