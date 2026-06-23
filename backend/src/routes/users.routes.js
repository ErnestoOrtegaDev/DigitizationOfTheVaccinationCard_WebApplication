import express from "express";
import {
    createUserWithDefaultPassword,
    updateUser,
    softDeleteUser,
    getActiveUsers
} from "../controllers/user.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtiene los usuarios activos del sistema
 *     tags: [Usuarios]
 *     responses:
 *       '200':
 *         description: Lista de usuarios activos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       status:
 *                         type: string
 */
router.get("/", getActiveUsers);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Crea un nuevo usuario con contraseña temporal si no se proporciona
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, role]
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@vacunapp.mx
 *               role:
 *                 type: string
 *                 enum: [admin, nurse, citizen]
 *                 example: nurse
 *               password:
 *                 type: string
 *                 example: VacunApp2026
 *     responses:
 *       '201':
 *         description: Usuario creado correctamente
 *       '400':
 *         description: Datos inválidos
 *       '409':
 *         description: El correo ya está registrado
 */
router.post("/", createUserWithDefaultPassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualiza los datos de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, nurse, citizen]
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Usuario actualizado correctamente
 *       '400':
 *         description: ID inválido o datos incompletos
 *       '404':
 *         description: Usuario no encontrado
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 *   delete:
 *     summary: Elimina lógicamente un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del usuario
 *     responses:
 *       '200':
 *         description: Usuario borrado correctamente
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Usuario no encontrado
 */
router.delete("/delete/:id", softDeleteUser);

export default router;