import express from "express";
import {
    createUserWithDefaultPassword,
    updateUser,
    softDeleteUser,
    getActiveUsers
} from "../controllers/user.controller.js";

// 1. Importamos tus middlewares reales con la carpeta y nombres correctos
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 2. Aplicamos tu autenticación de forma global para todo el archivo
router.use(protect);

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
// 3. Protegemos cada endpoint con tu función real authorizeRoles
router.get("/active", authorizeRoles('admin'), getActiveUsers);

/**
 * @swagger
 * /api/v1/users:
 * post:
 * summary: Crea un nuevo usuario con contraseña temporal si no se proporciona
 * tags: [Usuarios]
 */
router.post("/", authorizeRoles('admin'), createUserWithDefaultPassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 * put:
 * summary: Actualiza los datos de un usuario
 * tags: [Usuarios]
 */
router.put("/:id", authorizeRoles('admin'), updateUser);

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 * delete:
 * summary: Elimina lógicamente un usuario
 * tags: [Usuarios]
 */
router.delete("/delete/:id", authorizeRoles('admin'), softDeleteUser);

export default router;