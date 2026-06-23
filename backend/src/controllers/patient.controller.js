import Patient from "../models/patients.model.js";
import { encodeId, decodeId } from "../utils/hashids.js";

export const createPatient = async (req, res) => {
  try {
    const { curp, full_name, birth_date, gender } = req.body;
    const rawUserId = req.body.user_id || req.user?.id;

    if (!curp || !full_name || !birth_date || !gender) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios.",
      });
    }

    if (!rawUserId) {
      return res.status(400).json({
        status: "error",
        message: "No se pudo identificar al usuario autenticado.",
      });
    }

    let decodedUserId = null;

    if (typeof rawUserId === "number" || /^\d+$/.test(String(rawUserId))) {
      decodedUserId = Number(rawUserId);
    } else {
      decodedUserId = decodeId(rawUserId);
    }

    if (!decodedUserId) {
      return res.status(400).json({
        status: "error",
        message: "El identificador de usuario (user_id) no es válido.",
      });
    }

    const newPatient = await Patient.create({
      user_id: decodedUserId,
      curp,
      full_name,
      birth_date,
      gender,
    });

    res.status(201).json({
      status: "success",
      message: "Paciente registrado exitosamente.",
      data: {
        patientId: encodeId(newPatient.id),
        userId: rawUserId,
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
    
    console.error('[Patient Controller] Error al crear paciente:', error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el paciente.",
      error: error.message,
    });
  }
};

export const getPatientsByCreator = async (req, res) => {
  try {
    const rawUserId = req.params.userId || req.user?.id;

    let decodedUserId = null;

    if (typeof rawUserId === "number" || /^\d+$/.test(String(rawUserId))) {
      decodedUserId = Number(rawUserId);
    } else {
      decodedUserId = decodeId(rawUserId);
    }

    if (!decodedUserId) {
      return res.status(400).json({
        status: "error",
        message: "El identificador de usuario no es válido.",
      });
    }

    const patients = await Patient.findAll({
      where: { user_id: decodedUserId, status: "active" },
    });

    const obfuscatedPatients = patients.map((p) => {
      const data = p.toJSON();
      data.id = encodeId(data.id);
      data.user_id = encodeId(data.user_id);
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
    const { id } = req.params;
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
    const { id } = req.params;
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
    const { id } = req.params;
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
    const rawUserId = req.params.userId || req.user?.id;

    let decodedUserId = null;

    if (typeof rawUserId === "number" || /^\d+$/.test(String(rawUserId))) {
      decodedUserId = Number(rawUserId);
    } else {
      decodedUserId = decodeId(rawUserId);
    }

    if (!decodedUserId) {
      return res.status(400).json({
        status: "error",
        message: "El identificador de usuario no es válido.",
      });
    }

    const patients = await Patient.findAll({
      where: { user_id: decodedUserId },
    });

    const obfuscatedPatients = patients.map((p) => {
      const data = p.toJSON();
      data.id = encodeId(data.id);
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
