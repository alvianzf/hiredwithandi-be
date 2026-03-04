import { Router } from 'express';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../controllers/batch.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * tags:
 *   name: Batches
 *   description: Batch management for organizations
 */

// List batches (accessible by ADMIN and SUPERADMIN)
/**
 * @openapi
 * /organizations/{orgId}/batches:
 *   get:
 *     summary: List batches in an organization
 *     tags: [Batches]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/organizations/:orgId/batches', authorize(['ADMIN', 'SUPERADMIN']), getBatches);

// Manage batches (ADMIN and SUPERADMIN)
/**
 * @openapi
 * /organizations/{orgId}/batches:
 *   post:
 *     summary: Create a batch
 *     tags: [Batches]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/organizations/:orgId/batches', authorize(['ADMIN', 'SUPERADMIN']), createBatch);

/**
 * @openapi
 * /batches/{id}:
 *   patch:
 *     summary: Update a batch (name or status)
 *     tags: [Batches]
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
 *               status: { type: string, enum: [ACTIVE, DISABLED] }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/batches/:id', authorize(['ADMIN', 'SUPERADMIN']), updateBatch);

/**
 * @openapi
 * /batches/{id}:
 *   delete:
 *     summary: Delete a batch
 *     tags: [Batches]
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
router.delete('/batches/:id', authorize(['ADMIN', 'SUPERADMIN']), deleteBatch);

export default router;
