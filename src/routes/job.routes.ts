import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /jobs:
 *   get:
 *     summary: List user jobs
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *   post:
 *     summary: Create a job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Job'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Job'
 */
router.get('/', JobController.getAll);
router.post('/', JobController.create);

/**
 * @openapi
 * /jobs/{id}/status:
 *   patch:
 *     summary: Update job status
 *     tags: [Jobs]
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
 *               status: { type: string }
 *               boardPosition: { type: number }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id/status', JobController.updateStatus);

/**
 * @openapi
 * /jobs/{id}:
 *   patch:
 *     summary: Update job details
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 */
router.patch('/:id', JobController.updateDetails);
router.delete('/:id', JobController.delete);

export default router;
