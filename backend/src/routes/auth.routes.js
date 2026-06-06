/**
 * Enrutador de Autenticación - VacunApp MX
 * Define los endpoints relacionados con la creación de cuentas
 * y el inicio de sesión de los usuarios.
 */

import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { verifyToken, requireRole } from '../middlewares/auth.middleware.js'

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Crea una nueva cuenta de usuario en el sistema.
 * @access  Público (Cualquier persona puede intentar registrarse)
 * @body    { email (string), password (string), role (ENUM: 'admin', 'nurse', 'citizen') }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Autentica a un usuario y genera los tokens de sesión (Access y Refresh).
 * Los tokens se envían de regreso de forma segura a través de cookies HttpOnly.
 * @access  Público
 * @body    { email (string), password (string) }
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Ruta de prueba protegida. Devuelve los datos del usuario en sesión.
 * @access  Privado (Requiere Token)
 */
router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: '¡Tienes acceso a la zona segura!',
        userData: req.user // Esta es la información que decodificó el middleware
    });
});

/**
 * @route   GET /api/auth/admin-only
 * @desc    Ruta de prueba protegida y restringida por rol.
 * @access  Privado (Solo Admins)
 */
router.get('/admin-only', verifyToken, requireRole(['admin']), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Acceso autorizado. Eres un administrador.'
    });
});

export default router;
