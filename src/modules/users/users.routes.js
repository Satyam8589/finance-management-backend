import express from 'express';
import authenticate from '../../middlewares/auth.middleware.js';
import requireRole from '../../middlewares/role.middleware.js';
import { validate, updateRoleSchema, updateStatusSchema } from './users.validation.js';
import {
  getAllUsersController,
  getUserByIdController,
  updateUserRoleController,
  updateUserStatusController,
  deleteUserController
} from './users.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/', getAllUsersController);
router.get('/:id', getUserByIdController);
router.patch('/:id/role', validate(updateRoleSchema), updateUserRoleController);
router.patch('/:id/status', validate(updateStatusSchema), updateUserStatusController);
router.delete('/:id', deleteUserController);

export default router;

