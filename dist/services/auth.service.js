import prisma from '../config/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export class AuthService {
    static async register(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                name: data.name,
                role: data.role,
                orgId: data.orgId
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                orgId: true,
                createdAt: true
            }
        });
    }
    static async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user || user.status === 'DISABLED') {
            throw new Error('Invalid credentials or account disabled');
        }
        const isMatch = await bcrypt.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user.id, role: user.role, orgId: user.orgId }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                orgId: user.orgId
            }
        };
    }
}
//# sourceMappingURL=auth.service.js.map