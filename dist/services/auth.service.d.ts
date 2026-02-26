export declare class AuthService {
    static checkEmail(email: string): Promise<{
        exists: boolean;
    }>;
    static register(data: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        orgId: string | null;
        createdAt: Date;
    }>;
    static login(data: any): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            orgId: string | null;
        };
    }>;
}
