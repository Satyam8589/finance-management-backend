import express from 'express';
import authenticate from '../../middlewares/auth.middleware.js';
import requireRole from '../../middlewares/role.middleware.js';
import {
  getDashboardOverviewController,
  getCategoryBreakdownController,
  getMonthlyTrendsController
} from './dashboard.controller.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('analyst', 'admin'));

router.get('/overview', getDashboardOverviewController);
router.get('/categories', getCategoryBreakdownController);
router.get('/trends', getMonthlyTrendsController);

export default router;
