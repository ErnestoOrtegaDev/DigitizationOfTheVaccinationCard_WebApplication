import express from "express";
import {
  createUserWithDefaultPassword,
  updateUser,
  softDeleteUser,
  getActiveUsers
} from "../controllers/user.controller.js";
import { verifyToken, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: ID enmascarado del usuario
 *           example: "nAgmzLoe"
 *         email:
 *           type: string
 *           description: Correo electrónico único del usuario
 *           example: "admin@vacunapp.mx"
 *         role:
 *           type: string
 *           enum: [admin, nurse, citizen]
 *           description: Rol del usuario
 *           example: "admin"
 *         status:
 *           type: string
 *           enum: [active, inactive, deleted]
 *           description: Estado del usuario
 *           example: "active"
 *     UserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Operación exitosa
 *         data:
 *           $ref: '#/components/schemas/User'
 *     UserListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Mensaje descriptivo del error
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtiene los usuarios activos del sistema
 *     description: Retorna una lista de todos los usuarios con estado activo.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de usuarios activos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       '401':
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Acceso denegado (se requiere rol admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", verifyToken, requireRole(["admin"]), getActiveUsers);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Crea un nuevo usuario con contraseña temporal
 *     description: Registra un nuevo usuario en el sistema. Si no se proporciona contraseña, se asigna una temporal (VacunApp2026).
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@vacunapp.mx"
 *               role:
 *                 type: string
 *                 enum: [admin, nurse, citizen]
 *                 example: "nurse"
 *               password:
 *                 type: string
 *                 description: Contraseña opcional. Si no se proporciona, se usa VacunApp2026
 *                 example: "MiPassword123"
 *     responses:
 *       '201':
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Usuario creado exitosamente.
 *                 defaultPassword:
 *                   type: string
 *                   example: VacunApp2026
 *                 userId:
 *                   type: string
 *                   example: nAgmzLoe
 *       '400':
 *         description: Datos inválidos o faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Acceso denegado (se requiere rol admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         description: El correo ya está registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", verifyToken, requireRole(["admin"]), createUserWithDefaultPassword);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualiza los datos de un usuario
 *     description: Modifica información de un usuario existente (correo, rol, contraseña) mediante su ID enmascarado.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del usuario
 *         example: "nAgmzLoe"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "nuevoemail@vacunapp.mx"
 *               role:
 *                 type: string
 *                 enum: [admin, nurse, citizen]
 *                 example: "admin"
 *               password:
 *                 type: string
 *                 example: "NuevaPassword123"
 *     responses:
 *       '200':
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Los datos del usuario se modificaron correctamente.
 *       '400':
 *         description: ID inválido o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Acceso denegado (se requiere rol admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", verifyToken, requireRole(["admin"]), updateUser);

/**
 * @swagger
 * /api/v1/users/delete/{id}:
 *   delete:
 *     summary: Elimina lógicamente un usuario
 *     description: Marca un usuario como eliminado sin borrar su registro de la base de datos (soft delete).
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del usuario
 *         example: "nAgmzLoe"
 *     responses:
 *       '200':
 *         description: Usuario desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: El usuario ha sido desactivado del sistema (Borrado Lógico) correctamente.
 *       '400':
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '403':
 *         description: Acceso denegado (se requiere rol admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/delete/:id", verifyToken, requireRole(["admin"]), softDeleteUser);

export default router;