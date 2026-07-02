import { Op } from 'sequelize';
import Patient from '../models/patients.model.js';
import CartillaType from '../models/cartillaType.model.js';
import SchemeDose from '../models/schemeDose.model.js';
import Vaccine from '../models/vaccine.model.js';
import VaccinationRecord from '../models/vaccinationRecord.model.js';
import HealthCenter from '../models/healthCenter.model.js';
import { decodeId, encodeId } from '../utils/hashids.js';

export const getPatientCartilla = async (req, res) => {
    try {
        const { patientId } = req.params;

        const decodedPatientId = decodeId(patientId);

        if (!decodedPatientId) {
            return res.status(400).json({
                status: 'error',
                message: 'El identificador del paciente no es válido.'
            });
        }

        // Obtener los datos del paciente para validar su existencia y nacimiento
        const patient = await Patient.findByPk(decodedPatientId);
        if (!patient) {
            return res.status(404).json({
                status: 'error',
                message: 'Paciente no encontrado.'
            });
        }

        console.log('[Cartilla] Paciente encontrado:', patient.full_name);

        // Calcular la edad exacta en meses
        const birthDate = new Date(patient.birth_date);
        const currentDate = new Date();
        let ageInMonths = (currentDate.getFullYear() - birthDate.getFullYear()) * 12 + (currentDate.getMonth() - birthDate.getMonth());

        // Asegurar que la edad es al menos 0 (para recién nacidos o si la fecha es inválida)
        ageInMonths = Math.max(0, ageInMonths);

        console.log('[Cartilla] Edad calculada:', ageInMonths, 'meses');

        // Buscar el tipo de cartilla correspondiente según el rango de edad en meses
        const matchingCartilla = await CartillaType.findOne({
            where: {
                age_min_months: { [Op.lte]: ageInMonths },
                age_max_months: { [Op.gte]: ageInMonths }
            }
        });

        if (!matchingCartilla) {
            console.log('[Cartilla] No hay cartilla para edad:', ageInMonths, 'meses');
            return res.status(404).json({
                status: 'error',
                message: 'No se encontró un esquema de vacunación oficial para la edad actual del paciente.'
            });
        }

        console.log('[Cartilla] Cartilla encontrada: ID =', matchingCartilla.id, ', Nombre =', matchingCartilla.name);

        console.log('[Cartilla] Buscando registros para patient_id:', decodedPatientId);

        // Verificar si el paciente ya cuenta con un historial de vacunas generado
        let records = await VaccinationRecord.findAll({
            where: { patient_id: decodedPatientId },
            include: [
                {
                    model: Vaccine,
                    as: 'vaccine',
                    attributes: ['name', 'disease_prevented', 'administration_method']
                },
                {
                    model: SchemeDose,
                    as: 'scheme_dose',
                    attributes: ['dose_name', 'apply_at_months']
                }
            ]
        });

        console.log('[Cartilla] Registros encontrados:', records.length);

        // Si no existen registros, inicializamos automáticamente la cartilla oficial
        if (records.length === 0) {
            const officialDoses = await SchemeDose.findAll({
                where: { cartilla_type_id: matchingCartilla.id }
            });

            console.log('[Cartilla] SchemeDoses encontradas:', officialDoses.length, 'para cartilla_type_id:', matchingCartilla.id);

            if (officialDoses.length > 0) {
                const initialRecords = officialDoses.map(dose => ({
                    patient_id: decodedPatientId,
                    vaccine_id: dose.vaccine_id,
                    scheme_dose_id: dose.id,
                    status: 'pending',
                    is_manual_entry: false
                }));

                console.log('[Cartilla] Creando', initialRecords.length, 'registros iniciales');
                await VaccinationRecord.bulkCreate(initialRecords);
                console.log('[Cartilla] Registros creados exitosamente');

                // Volvemos a consultar para recuperar la estructura con las relaciones incluidas
                records = await VaccinationRecord.findAll({
                    where: { patient_id: decodedPatientId },
                    include: [
                        { model: Vaccine, as: 'vaccine', attributes: ['name', 'disease_prevented', 'administration_method'] },
                        { model: SchemeDose, as: 'scheme_dose', attributes: ['dose_name', 'apply_at_months'] }
                    ]
                });
                console.log('[Cartilla] Después de crear, registros encontrados:', records.length);
            } else {
                console.log('[Cartilla] No hay SchemeDoses para esta cartilla');
            }
        } 

        // Ofuscar los identificadores numéricos en la respuesta antes de enviarla al cliente
        const safeRecords = records.map(record => {
            const data = record.toJSON();
            return {
                ...data,
                id: encodeId(data.id),
                patient_id: patientId,
                vaccine_id: encodeId(data.vaccine_id),
                scheme_dose_id: data.scheme_dose_id ? encodeId(data.scheme_dose_id) : null,
                campaign_batch_id: data.campaign_batch_id ? encodeId(data.campaign_batch_id) : null,
                health_center_id: data.health_center_id ? encodeId(data.health_center_id) : null,
                applied_by_user_id: data.applied_by_user_id ? encodeId(data.applied_by_user_id) : null
            };
        });

        return res.status(200).json({
            status: 'success',
            cartilla_info: {
                name: matchingCartilla.name,
                patient_age_months: ageInMonths
            },
            data: safeRecords
        });

    } catch (error) {
        console.error('[Cartilla Controller] Error al procesar cartilla:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Falla interna al procesar el esquema de vacunación del paciente.'
        });
    }
};

export const markAsApplied = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { health_center_id } = req.body; 

        console.log("Datos recibidos:", { recordId, health_center_id });

        const decodedRecordId = decodeId(recordId);

        if (!decodedRecordId) {
            return res.status(400).json({ status: 'error', message: 'ID de registro inválido.' });
        }

        // Obtener el registro actual
        const currentRecord = await VaccinationRecord.findByPk(decodedRecordId, {
            include: [{ model: SchemeDose, as: 'scheme_dose', attributes: ['apply_at_months'] }]
        });

        if (!currentRecord) {
            return res.status(404).json({ status: 'error', message: 'Registro de vacunación no encontrado.' });
        }

        // Decodificamos el ID del centro
        const centerId = decodeId(health_center_id);

        if (!centerId) {
            return res.status(400).json({ status: 'error', message: 'Centro de salud inválido o malformado.' });
        }

        // Validar que el centro realmente exista en la base de datos antes de hacer el UPDATE
        const centerExists = await HealthCenter.findByPk(centerId);
        if (!centerExists) {
            return res.status(404).json({ status: 'error', message: 'El centro de salud seleccionado no está registrado.' });
        }

        // Validar que las dosis anteriores estén aplicadas
        const previousDoses = await VaccinationRecord.findAll({
            where: {
                patient_id: currentRecord.patient_id,
                vaccine_id: currentRecord.vaccine_id,
                status: 'pending'
            },
            include: [
                {
                    model: SchemeDose,
                    as: 'scheme_dose',
                    attributes: ['apply_at_months']
                }
            ]
        });

        // Filtrar dosis anteriores (con menor edad de aplicación)
        const currentMonths = currentRecord.scheme_dose?.apply_at_months || 0;
        const earlierPendingDoses = previousDoses.filter(dose => 
            dose.scheme_dose && dose.scheme_dose.apply_at_months < currentMonths
        );

        if (earlierPendingDoses.length > 0) {
            return res.status(400).json({
                status: 'error',
                message: `No puedes aplicar esta dosis. Hay ${earlierPendingDoses.length} dosis anterior(es) que deben ser aplicadas primero.`
            });
        }

        // Ejecutar el update
        const [updatedRows] = await VaccinationRecord.update({
            status: 'applied',
            application_date: new Date(),
            health_center_id: centerId,
            applied_by_user_id: req.user.id
        }, {
            where: { id: decodedRecordId }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'No se pudo actualizar el registro.' });
        }

        res.json({ status: 'success', message: 'Dosis aplicada correctamente.' });
    } catch (error) {
        console.error("ERROR DETALLADO:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};