import Vaccine from '../models/vaccine.model.js';
import { encodeId, decodeId } from '../utils/hashids.js';

// Obtener todas las vacunas (Catálogo)
export const getAllVaccines = async (req, res) => {
    try {
        const vaccines = await Vaccine.findAll();
        
        // Mapeamos para enmascarar los IDs antes de enviarlos al frontend
        const secureVaccines = vaccines.map(v => ({
            id: encodeId(v.id),
            name: v.name,
            disease_prevented: v.disease_prevented,
            administration_method: v.administration_method
        }));

        return res.status(200).json({ status: 'success', data: secureVaccines });
    } catch (error) {
        console.error('[Vaccine Controller] Error en getAllVaccines:', error);
        return res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};

// Crear una nueva vacuna
export const createVaccine = async (req, res) => {
    const { name, disease_prevented, administration_method } = req.body;

    if (!name || !disease_prevented || !administration_method) {
        return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
    }

    try {
        const newVaccine = await Vaccine.create({
            name,
            disease_prevented,
            administration_method
        });

        return res.status(201).json({ 
            status: 'success', 
            message: 'Vacuna agregada al catálogo exitosamente',
            data: { ...newVaccine.toJSON(), id: encodeId(newVaccine.id) }
        });
    } catch (error) {
        console.error('[Vaccine Controller] Error en createVaccine:', error);
        return res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};

// Actualizar una vacuna
export const updateVaccine = async (req, res) => {
    const { id } = req.params;
    const { name, disease_prevented, administration_method } = req.body;

    try {
        const decodedId = decodeId(id);
        if (!decodedId) return res.status(400).json({ status: 'error', message: 'ID inválido' });

        const vaccine = await Vaccine.findByPk(decodedId);
        if (!vaccine) return res.status(404).json({ status: 'error', message: 'Vacuna no encontrada' });

        if (name) vaccine.name = name;
        if (disease_prevented) vaccine.disease_prevented = disease_prevented;
        if (administration_method) vaccine.administration_method = administration_method;

        await vaccine.save();

        return res.status(200).json({ status: 'success', message: 'Datos de la vacuna actualizados' });
    } catch (error) {
        console.error('[Vaccine Controller] Error en updateVaccine:', error);
        return res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};

// Eliminar una vacuna
export const deleteVaccine = async (req, res) => {
    const { id } = req.params;

    try {
        const decodedId = decodeId(id);
        if (!decodedId) return res.status(400).json({ status: 'error', message: 'ID inválido' });

        const vaccine = await Vaccine.findByPk(decodedId);
        if (!vaccine) return res.status(404).json({ status: 'error', message: 'Vacuna no encontrada' });

        await vaccine.destroy(); // Borrado físico (o lógico si configuraste paranoid: true en el modelo)

        return res.status(200).json({ status: 'success', message: 'Vacuna eliminada del catálogo' });
    } catch (error) {
        console.error('[Vaccine Controller] Error en deleteVaccine:', error);
        return res.status(500).json({ status: 'error', message: 'Falla interna del servidor' });
    }
};