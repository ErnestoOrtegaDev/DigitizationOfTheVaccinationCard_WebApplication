import express from "express";
import {
    createUserWithDefaultPassword,
    updateUser,
    softDeleteUser,
    getActiveUsers
} from "../controllers/user.controller.js";

// 1. Importamos tus middlewares reales
import { requireAuth } from "../middlewares/auth.middleware.js"; 
import { requireRole } from "../middlewares/role.middleware.js"; 

const router = express.Router();

// 2. Aplicamos tu autenticación de forma global para todo el archivo
router.use(requireAuth);

/**
 * @swagger
 * /api/v1/users/active:
 * get:
 * summary: Obtiene los usuarios activos del sistema
 * tags: [Usuarios]
 * responses:
 * '200':
 * description: Lista de usuarios activos
 */
// 3. Protegemos cada endpoint con tu requireRole
router.get("/active", requireRole('admin'), getActiveUsers);

/**
 * @swagger
 * /api/v1/users:
 * post:
 * summary: Crea un nuevo usuario con contraseña temporal si no se proporciona
 * tags: [Usuarios]
 */
router.post("/", requireRole('admin'), createUserWithDefaultPassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 * put:
 * summary: Actualiza los datos de un usuario
 * tags: [Usuarios]
 */
router.put("/:id", requireRole('admin'), updateUser);

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 * delete:
 * summary: Elimina lógicamente un usuario
 * tags: [Usuarios]
 */
router.delete("/delete/:id", requireRole('admin'), softDeleteUser);

export default router;