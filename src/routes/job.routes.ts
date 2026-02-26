import { Router } from 'express';
import { JobController } from '../controllers/job.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', JobController.getAll);
router.post('/', JobController.create);
router.patch('/:id/status', JobController.updateStatus);
router.patch('/:id', JobController.updateDetails);
router.delete('/:id', JobController.delete);

export default router;
