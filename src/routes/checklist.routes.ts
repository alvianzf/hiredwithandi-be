import { Router } from 'express';
import { getMyChecklist, updateMyChecklist, completeMyChecklist, getOrgChecklistStats } from '../controllers/checklist.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected routes (all require authentication)
router.use(authenticate);

// Member-facing routes
router.get('/', getMyChecklist);
router.put('/', updateMyChecklist);
router.post('/complete', completeMyChecklist);

// Admin-facing routes
router.get('/org/:orgId', authorize(['ADMIN', 'SUPERADMIN']), getOrgChecklistStats);

export default router;
