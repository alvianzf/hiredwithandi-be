export declare class AuthService {
    static checkEmail(email: string): Promise<{
        exists: boolean;
        hasPassword: boolean;
    }>;
    static register(data: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        orgId: string | null;
        createdAt: Date;
    }>;
    static setupPassword(data: any): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            orgId: string | null;
        };
    }>;
    static login(data: any): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            orgId: string | null;
        };
    }>;
    static refresh(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            orgId: string | null;
        };
    }>;
    static changePassword(userId: string, data: any): Promise<{
        message: string;
    }>;
}
