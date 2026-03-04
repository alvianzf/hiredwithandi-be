import { Router } from 'express';
import { getBatches, createBatch, updateBatch, deleteBatch } from '../controllers/batch.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

// List batches (accessible by ADMIN and SUPERADMIN)
router.get('/organizations/:orgId/batches', authorize(['ADMIN', 'SUPERADMIN']), getBatches);

// Manage batches (ADMIN and SUPERADMIN)
router.post('/organizations/:orgId/batches', authorize(['ADMIN', 'SUPERADMIN']), createBatch);
router.patch('/batches/:id', authorize(['ADMIN', 'SUPERADMIN']), updateBatch);
router.delete('/batches/:id', authorize(['ADMIN', 'SUPERADMIN']), deleteBatch);

export default router;
