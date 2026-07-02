import express from 'express';
import { getPatientCartilla, markAsApplied } from '../controllers/cartilla.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VaccinationRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID enmascarado del registro de vacunación
 *           example: "bK9mZlow"
 *         patient_id:
 *           type: string
 *           description: ID enmascarado del paciente
 *           example: "zXy9WvQ1"
 *         status:
 *           type: string
 *           enum: [pending, applied, cancelled]
 *           description: Estado actual de la dosis
 *           example: "pending"
 *         application_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: null
 *         vaccine:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "BCG"
 *             disease_prevented:
 *               type: string
 *               example: "Tuberculosis"
 *             scheme_dose:
 *               type: object
 *               properties:
 *                 dose_name:
 *                   type: string
 *                   example: "Única"
 *                 apply_at_months:
 *                   type: integer
 *                   example: 0
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
 * /api/v1/cartillas/patient/{patientId}:
 *   get:
 *     summary: Obtiene o inicializa la cartilla de vacunación de un paciente
 *     description: Calcula la edad del paciente en meses, asocia el tipo de cartilla oficial correspondiente y devuelve su esquema detallado de dosis.
 *     tags: [Cartillas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID enmascarado del paciente
 *         example: "zXy9WvQ1"
 *     responses:
 *       '200':
 *         description: Estructura de la cartilla obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 cartilla_info:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Niñas y Niños de 0 a 9 años"
 *                     patient_age_months:
 *                       type: integer
 *                       example: 18
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/VaccinationRecord'
 *       '400':
 *         description: ID de paciente inválido
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
 *       '404':
 *         description: Paciente o esquema correspondiente no encontrado
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
router.get('/patient/:patientId', verifyToken, getPatientCartilla);
router.put('/record/:recordId', verifyToken, markAsApplied);

export default router;