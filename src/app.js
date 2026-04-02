import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import recordRoutes from './modules/records/records.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import globalErrorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Zorvyn Finance API is running',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found. Valid endpoints start with /api',
    data: null,
  });
});


app.use(globalErrorHandler);

export default app;

