export declare class AuthService {
    static register(data: any): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        orgId: string | null;
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
