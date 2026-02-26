import { Router } from 'express';
import { OrganizationController, UserController } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Organization routes
router.get('/organizations', authenticate, authorize(['SUPERADMIN']), OrganizationController.getAll);
router.post('/organizations', authenticate, authorize(['SUPERADMIN']), OrganizationController.create);

// User/Student routes
router.get('/students', authenticate, authorize(['ADMIN', 'SUPERADMIN']), UserController.getStudents);
router.get('/stats', authenticate, authorize(['SUPERADMIN']), UserController.getStats);

export default router;
