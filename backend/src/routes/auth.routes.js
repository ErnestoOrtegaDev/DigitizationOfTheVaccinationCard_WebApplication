
import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js'

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Crea una nueva cuenta de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, nurse, citizen]
 *     responses:
 *       '201':
 *         description: Usuario registrado exitosamente
 */
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicia sesión y genera tokens de sesión
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Autenticación exitosa
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Obtiene datos del usuario en sesión
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Datos obtenidos correctamente
 */
router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: '¡Tienes acceso a la zona segura!',
        userData: req.user
    });
});

export default router;