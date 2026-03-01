import { AuthService } from '../services/auth.service.js';
import { loginSchema, registerSchema, checkEmailSchema, refreshTokenSchema } from '../validators/auth.validator.js';
export class AuthController {
    static async checkEmail(req, res) {
        try {
            const { email } = checkEmailSchema.parse(req.body);
            const result = await AuthService.checkEmail(email);
            res.json({ data: result });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
            }
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async register(req, res) {
        try {
            const validatedData = registerSchema.parse(req.body);
            const user = await AuthService.register(validatedData);
            res.status(201).json({ data: user });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
            }
            res.status(500).json({ error: { message: error.message } });
        }
    }
    static async setupPassword(req, res) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await AuthService.setupPassword(validatedData);
            res.json({ data: result });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
            }
            res.status(400).json({ error: { message: error.message } });
        }
    }
    static async login(req, res) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await AuthService.login(validatedData);
            res.json({ data: result });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
            }
            res.status(401).json({ error: { message: error.message } });
        }
    }
    static async refresh(req, res) {
        try {
            const { refreshToken } = refreshTokenSchema.parse(req.body);
            const result = await AuthService.refresh(refreshToken);
            res.json({ data: result });
        }
        catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
            }
            res.status(401).json({ error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=auth.controller.js.map