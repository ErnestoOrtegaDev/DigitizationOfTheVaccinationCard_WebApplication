import express from "express";
import {
  createPatient,
  getPatientsByCreator,
  getPatientById,
  updatePatient,
  deletePatient,
  getAllPatientsByCreator,
} from "../controllers/patient.controller.js";
import { requireRole, verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - user_id
 *         - curp
 *         - full_name
 *         - birth_date
 *         - gender
 *       properties:
 *         id:
 *           type: string
 *           description: ID enmascarado del paciente
 *         user_id:
 *           type: string
 *           description: ID enmascarado del usuario creador del paciente
 *         curp:
 *           type: string
 *           description: CURP del paciente
 *         full_name:
 *           type: string
 *           description: Nombre completo del paciente
 *         birth_date:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento del paciente
 *         gender:
 *           type: string
 *           enum: [M, F, O]
 *           description: Género del paciente
 *         status:
 *           type: string
 *           enum: [active, inactive, deleted]
 *           description: Estado del paciente
 */
/**
 * @swagger
 * /api/v1/patients/{id}:
 *   get:
 *     summary: Obtiene un paciente por su ID
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del paciente
 *     responses:
 *       '200':
 *         description: Paciente encontrado
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Paciente no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/:id", verifyToken, requireRole("admin", "nurse"), getPatientById);

/**
 * @swagger
 * /api/v1/patients/user/{userId}:
 *   get:
 *     summary: Obtiene los pacientes activos creados por un usuario
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del usuario creador
 *     responses:
 *       '200':
 *         description: Lista de pacientes obtenida correctamente
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/user/:userId", verifyToken, getPatientsByCreator);

/**
 * @swagger
 * /api/v1/patients/user/{userId}/all:
 *   get:
 *     summary: Obtiene todos los pacientes de un usuario sin filtrar por estado
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del usuario creador
 *     responses:
 *       '200':
 *         description: Lista completa de pacientes obtenida correctamente
 *       '500':
 *         description: Error interno del servidor
 */
router.get("/user/:userId/all", verifyToken, getAllPatientsByCreator);

/**
 * @swagger
 * /api/v1/patients:
 *   post:
 *     summary: Registra un nuevo paciente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "abc123"
 *               curp:
 *                 type: string
 *                 example: "GOMJ960101HDFLRN09"
 *               full_name:
 *                 type: string
 *                 example: "Juan Pérez López"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "1996-01-01"
 *               gender:
 *                 type: string
 *                 enum: [M, F, O]
 *                 example: "M"
 *     responses:
 *       '201':
 *         description: Paciente registrado exitosamente
 *       '400':
 *         description: Datos inválidos o CURP duplicado
 *       '500':
 *         description: Error interno del servidor
 */
router.post("/", verifyToken, createPatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   put:
 *     summary: Actualiza los datos de un paciente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               curp:
 *                 type: string
 *                 example: "GOMJ960101HDFLRN09"
 *               full_name:
 *                 type: string
 *                 example: "Juan Pérez López"
 *               birth_date:
 *                 type: string
 *                 format: date
 *                 example: "1996-01-01"
 *               gender:
 *                 type: string
 *                 enum: [M, F, O]
 *                 example: "M"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, deleted]
 *                 example: "active"
 *     responses:
 *       '200':
 *         description: Paciente actualizado correctamente
 *       '400':
 *         description: ID inválido o datos inválidos
 *       '404':
 *         description: Paciente no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.put("/:id", verifyToken, updatePatient);

/**
 * @swagger
 * /api/v1/patients/{id}:
 *   delete:
 *     summary: Elimina un paciente mediante soft delete
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del paciente
 *     responses:
 *       '200':
 *         description: Paciente eliminado correctamente mediante soft delete
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Paciente no encontrado
 *       '500':
 *         description: Error interno del servidor
 */
router.delete("/:id", verifyToken, deletePatient);

export default router;
