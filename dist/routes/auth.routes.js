import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
const router = Router();
/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               name: { type: string }
 *               role: { type: string, enum: [SUPERADMIN, ADMIN, STUDENT] }
 *               orgId: { type: string }
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/register', AuthController.register);
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', AuthController.login);
export default router;
//# sourceMappingURL=auth.routes.js.map