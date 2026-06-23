import { Router } from 'express';
import {
    getAllVaccines,
    createVaccine,
    updateVaccine,
    deleteVaccine,
} from '../controllers/vaccine.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vaccine:
 *       type: object
 *       required:
 *         - name
 *         - disease_prevented
 *         - administration_method
 *       properties:
 *         id:
 *           type: string
 *           description: ID enmascarado de la vacuna
 *         name:
 *           type: string
 *           description: Nombre oficial de la vacuna
 *         disease_prevented:
 *           type: string
 *           description: Enfermedad principal que previene
 *         administration_method:
 *           type: string
 *           description: Vía de administración (ej. Intramuscular, Oral, Subcutánea)
 */

/**
 * @swagger
 * /api/v1/vaccines:
 *   get:
 *     summary: Obtiene el catálogo completo de vacunas
 *     tags: [Vacunas]
 *     responses:
 *       '200':
 *         description: Lista de vacunas obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Vaccine'
 *       '500':
 *         description: Falla interna del servidor
 */
router.get('/', getAllVaccines);

/**
 * @swagger
 * /api/v1/vaccines:
 *   post:
 *     summary: Agrega una nueva vacuna al catálogo
 *     tags: [Vacunas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: BCG
 *               disease_prevented:
 *                 type: string
 *                 example: Tuberculosis
 *               administration_method:
 *                 type: string
 *                 example: Intradérmica
 *     responses:
 *       '201':
 *         description: Vacuna agregada exitosamente
 *       '400':
 *         description: Faltan campos obligatorios
 *       '500':
 *         description: Falla interna del servidor
 */
router.post('/', createVaccine);

/**
 * @swagger
 * /api/v1/vaccines/{id}:
 *   put:
 *     summary: Actualiza los datos de una vacuna existente
 *     tags: [Vacunas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID enmascarado de la vacuna
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               disease_prevented:
 *                 type: string
 *               administration_method:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Datos de la vacuna actualizados
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Vacuna no encontrada
 *       '500':
 *         description: Falla interna del servidor
 */
router.put('/:id', updateVaccine);

/**
 * @swagger
 * /api/v1/vaccines/{id}:
 *   delete:
 *     summary: Elimina una vacuna del catálogo
 *     tags: [Vacunas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID enmascarado de la vacuna
 *     responses:
 *       '200':
 *         description: Vacuna eliminada del catálogo
 *       '400':
 *         description: ID inválido
 *       '404':
 *         description: Vacuna no encontrada
 *       '500':
 *         description: Falla interna del servidor
 */
router.delete('/:id', deleteVaccine);

export default router;