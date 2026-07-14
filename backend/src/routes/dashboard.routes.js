import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta para obtener las estadísticas del dashboard
router.get('/', verifyToken, getDashboardStats);

export default router;
