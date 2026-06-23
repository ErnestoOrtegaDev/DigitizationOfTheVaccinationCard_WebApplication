import Patient from "../models/patients.model.js";
import { encodeId, decodeId } from "../utils/hashids.js";

export const createPatient = async (req, res) => {
  try {
    const { user_id, curp, full_name, birth_date, gender } = req.body;

    if (!user_id || !curp || !full_name || !birth_date || !gender) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios.",
      });
    }

    // El user_id llega como entero (gracias al JWT). Lo dejamos pasar directo.
    const newPatient = await Patient.create({
      user_id,
      curp,
      full_name,
      birth_date,
      gender,
    });

    res.status(201).json({
      status: "success",
      message: "Paciente registrado exitosamente.",
      data: {
        patientId: encodeId(newPatient.id), // Enmascaramos el ID del paciente creado
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: "error",
        message: "El CURP ya se encuentra registrado.",
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors[0].message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Error al crear el paciente.",
      error: error.message,
    });
  }
};

export const getPatientsByCreator = async (req, res) => {
  try {
    const { userId } = req.params; // Llega el número entero (ej. 1) desde el JWT

    const patients = await Patient.findAll({
      where: { user_id: userId, status: "active" },
    });

    // Transformamos los IDs de los pacientes para el frontend
    const obfuscatedPatients = patients.map((p) => {
      const data = p.toJSON();
      data.id = encodeId(data.id); // El ID del paciente pasa a Hash
      data.user_id = encodeId(data.user_id); // El ID del creador pasa a Hash en el JSON de salida
      return data;
    });

    res.status(200).json({ status: "success", data: obfuscatedPatients });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener los pacientes.",
      error: error.message,
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params; // Aquí sí llega el HASH del paciente desde la URL
    const realPatientId = decodeId(id);

    if (!realPatientId) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de paciente no válido." });
    }

    const patient = await Patient.findByPk(realPatientId);

    if (!patient) {
      return res
        .status(404)
        .json({ status: "error", message: "Paciente no encontrado." });
    }

    const data = patient.toJSON();
    data.id = encodeId(data.id);
    data.user_id = encodeId(data.user_id);

    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el paciente.",
      error: error.message,
    });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params; // Llega el HASH del paciente
    const { curp, full_name, birth_date, gender, status } = req.body;
    const realPatientId = decodeId(id);

    if (!realPatientId) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de paciente no válido." });
    }

    const [updatedRows] = await Patient.update(
      { curp, full_name, birth_date, gender, status },
      { where: { id: realPatientId } },
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Paciente no encontrado.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Paciente actualizado exitosamente.",
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: "error",
        message: "El CURP ya está siendo usado por otro paciente.",
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors[0].message,
      });
    }
    res.status(500).json({
      status: "error",
      message: "Error al actualizar el paciente.",
      error: error.message,
    });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params; // Llega el HASH del paciente
    const realPatientId = decodeId(id);

    if (!realPatientId) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de paciente no válido." });
    }

    const [updatedRows] = await Patient.update(
      { status: "inactive" },
      { where: { id: realPatientId } },
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Paciente no encontrado." });
    }

    res.status(200).json({
      status: "success",
      message: "Paciente marcado como inactivo correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al cambiar el estado del paciente.",
      error: error.message,
    });
  }
};

export const getAllPatientsByCreator = async (req, res) => {
  try {
    const { userId } = req.params; // Llega entero '1' desde la URL

    const patients = await Patient.findAll({
      where: { user_id: userId },
    });

    const obfuscatedPatients = patients.map((p) => {
      const data = p.toJSON();
      data.id = encodeId(data.id); // Enmascaramos el ID del paciente para el JSON de respuesta
      data.user_id = encodeId(data.user_id);
      return data;
    });

    res.status(200).json({ status: "success", data: obfuscatedPatients });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener todos los pacientes.",
      error: error.message,
    });
  }
};
