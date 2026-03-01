import { Router } from 'express';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../controllers/batch.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

// List batches (accessible by ADMIN and SUPERADMIN)
router.get('/organizations/:orgId/batches', authorize(['ADMIN', 'SUPERADMIN']), getBatches);

// Manage batches (SUPERADMIN only)
router.post('/organizations/:orgId/batches', authorize(['SUPERADMIN']), createBatch);
router.patch('/batches/:id', authorize(['SUPERADMIN']), updateBatch);
router.delete('/batches/:id', authorize(['SUPERADMIN']), deleteBatch);

export default router;
