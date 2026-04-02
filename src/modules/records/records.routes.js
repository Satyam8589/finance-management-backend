import express from 'express';
import authenticate from '../../middlewares/auth.middleware.js';
import requireRole from '../../middlewares/role.middleware.js';
import { validate, createRecordSchema, updateRecordSchema } from './records.validation.js';
import {
  createRecordController,
  getAllRecordsController,
  getRecordByIdController,
  updateRecordController,
  deleteRecordController,
} from './records.controller.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllRecordsController);
router.get('/:id', getRecordByIdController);

router.post('/', requireRole('admin'), validate(createRecordSchema), createRecordController);
router.patch('/:id', requireRole('admin'), validate(updateRecordSchema), updateRecordController);
router.delete('/:id', requireRole('admin'), deleteRecordController);

export default router;

