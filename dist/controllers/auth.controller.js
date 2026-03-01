import { AuthService } from '../services/auth.service.js';
import { loginSchema, registerSchema, checkEmailSchema, refreshTokenSchema, changePasswordSchema } from '../validators/auth.validator.js';
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
    static async changePassword(req, res) {
        console.log('[AuthController] changePassword request received');
        console.log('[AuthController] User ID from token:', req.user?.id);
        try {
            const validatedData = changePasswordSchema.parse(req.body);
            console.log('[AuthController] Data validated successfully');
            const result = await AuthService.changePassword(req.user.id, validatedData);
            console.log('[AuthController] AuthService returned success');
            res.json({ data: result });
        }
        catch (error) {
            console.log('[AuthController] Error in changePassword:', error.message);
            if (error.name === 'ZodError') {
                return res.status(400).json({ error: { message: 'Validation failed', details: error.errors } });
            }
            res.status(400).json({ error: { message: error.message } });
        }
    }
}
//# sourceMappingURL=auth.controller.js.map