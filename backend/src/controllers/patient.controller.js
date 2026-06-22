import Patient from "../models/patients.model.js";

export const createPatient = async (req, res) => {
  try {
    const { user_id, curp, full_name, birth_date, gender } = req.body;

    if (!user_id || !curp || !full_name || !birth_date || !gender) {
      return res.status(400).json({
        status: "error",
        message: "Todos los campos son obligatorios.",
      });
    }

    // Nota: Eliminamos el check manual de longitud de CURP. Ahora lo maneja el modelo.

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
      data: { patientId: newPatient.id },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: "error",
        message: "El CURP ya se encuentra registrado.",
      });
    }
    // Optimización: Atrapamos errores de formato o validación del modelo
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
    const { userId } = req.params;
    const patients = await Patient.findAll({
      where: { user_id: userId, status: "active" },
    });
    res.status(200).json({ status: "success", data: patients });
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
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res
        .status(404)
        .json({ status: "error", message: "Paciente no encontrado." });
    }
    res.status(200).json({ status: "success", data: patient });
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

    const [updatedRows] = await Patient.update(
      { curp, full_name, birth_date, gender, status },
      { where: { id } },
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
    // Optimización: Atrapamos errores de formato o validación en actualizaciones
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

    const [updatedRows] = await Patient.update(
      { status: "inactive" },
      { where: { id } },
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
    const { userId } = req.params;

    const patients = await Patient.findAll({
      where: { user_id: userId },
    });

    res.status(200).json({ status: "success", data: patients });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener todos los pacientes.",
      error: error.message,
    });
  }
};
