import express from "express";
import {
    createUserWithDefaultPassword,
    updateUser,
    softDeleteUser,
    getActiveUsers
} from "../controllers/user.controller.js";

// Importaciones 
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 * get:
 * summary: Obtiene los usuarios activos del sistema
 * tags: [Usuarios]
 */
// Solo el administrador autenticado puede ver los usuarios activos
router.get("/", verifyToken, requireRole(["admin"]), getActiveUsers);

/**
 * @swagger
 * /api/v1/users:
 * post:
 * summary: Crea un nuevo usuario con contraseña temporal si no se proporciona
 * tags: [Usuarios]
 */
router.post("/", verifyToken, requireRole(["admin"]), createUserWithDefaultPassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 * put:
 * summary: Actualiza los datos de un usuario
 * tags: [Usuarios]
 */
router.put("/:id", verifyToken, requireRole(["admin"]), updateUser);

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 * delete:
 * summary: Elimina lógicamente un usuario
 * tags: [Usuarios]
 */
router.delete("/delete/:id", verifyToken, requireRole(["admin"]), softDeleteUser);

export default router;