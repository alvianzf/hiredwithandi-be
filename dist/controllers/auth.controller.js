import { AuthService } from '../services/auth.service.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
export class AuthController {
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
}
//# sourceMappingURL=auth.controller.js.map