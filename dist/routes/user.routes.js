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
/**
 * @openapi
 * /organizations/{id}:
 *   patch:
 *     summary: Update an organization
 *     tags: [Organizations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               status: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organizations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 */
router.get('/organizations', authenticate, authorize(['SUPERADMIN']), OrganizationController.getAll);
router.post('/organizations', authenticate, authorize(['SUPERADMIN']), OrganizationController.create);
router.patch('/organizations/:id', authenticate, authorize(['SUPERADMIN']), OrganizationController.update);
router.delete('/organizations/:id', authenticate, authorize(['SUPERADMIN']), OrganizationController.delete);
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
router.get('/students/:id/dashboard', authenticate, authorize(['ADMIN', 'SUPERADMIN']), AnalyticsController.getStudentDashboard);
router.get('/students/:id', authenticate, authorize(['ADMIN', 'SUPERADMIN']), UserController.getStudentById);
router.post('/batch-students', authenticate, authorize(['ADMIN', 'SUPERADMIN']), UserController.batchCreateStudents);
/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users globally
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 *   post:
 *     summary: Create a user manually
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               role: { type: string }
 *               orgId: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.get('/users', authenticate, authorize(['SUPERADMIN']), UserController.getAllUsers);
router.post('/users', authenticate, authorize(['SUPERADMIN', 'ADMIN']), UserController.createUser);
/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update a user's details, role, or status
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               status: { type: string }
 *               role: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/users/:id', authenticate, authorize(['SUPERADMIN', 'ADMIN']), UserController.updateUser);
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
/**
 * @openapi
 * /students/{id}/stats:
 *   get:
 *     summary: Get a specific student's job statistics
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
router.get('/students/:id/stats', authenticate, authorize(['ADMIN', 'SUPERADMIN']), AnalyticsController.getStudentStats);
export default router;
//# sourceMappingURL=user.routes.js.map