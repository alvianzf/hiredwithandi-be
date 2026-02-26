import { Router } from 'express';
import { OrganizationController, UserController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /organizations:
 *   get:
 *     summary: List all organizations
 *     tags: [Organizations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create an organization
 *     tags: [Organizations]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/organizations', authenticate, authorize(['SUPERADMIN']), OrganizationController.getAll);
router.post('/organizations', authenticate, authorize(['SUPERADMIN']), OrganizationController.create);

/**
 * @openapi
 * /students:
 *   get:
 *     summary: List students in an organization
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/students', authenticate, authorize(['ADMIN', 'SUPERADMIN']), UserController.getStudents);

/**
 * @openapi
 * /stats:
 *   get:
 *     summary: Get system stats
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/stats', authenticate, authorize(['SUPERADMIN']), UserController.getStats);

export default router;
