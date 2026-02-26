import { Router } from 'express';
import { OrganizationController, UserController } from '../controllers/user.controller.js';
import { AnalyticsController } from '../controllers/analytics.controller.js';
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
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 *   patch:
 *     summary: Update user profile (including photo)
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *     responses:
 *       200:
 *         description: Updated
 */
router.get('/profile', authenticate, UserController.getProfile);
router.patch('/profile', authenticate, UserController.updateProfile);
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
/**
 * @openapi
 * /organizations/{id}/stats:
 *   get:
 *     summary: Get organization job statistics
 *     tags: [Analytics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/organizations/:id/stats', authenticate, authorize(['ADMIN', 'SUPERADMIN']), AnalyticsController.getOrgStats);
export default router;
//# sourceMappingURL=user.routes.js.map