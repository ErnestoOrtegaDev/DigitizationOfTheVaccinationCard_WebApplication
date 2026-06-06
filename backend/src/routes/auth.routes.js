/**
 * Enrutador de Autenticación - VacunApp MX
 * Define los endpoints relacionados con la creación de cuentas
 * y el inicio de sesión de los usuarios.
 */

import express from 'express';
import { register, login } from '../controllers/auth.controller.js';

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

export default router;