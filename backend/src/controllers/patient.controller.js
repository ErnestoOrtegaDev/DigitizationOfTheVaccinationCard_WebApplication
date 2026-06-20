import Patient from "../models/patients.model.js";

export const createPatient = async (req, res) => {
  try {
    const { user_id, curp, full_name, birth_date, gender } = req.body;

    if (!user_id || !curp || !full_name || !birth_date || !gender) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Todos los campos son obligatorios.",
        });
    }

    if (curp.length !== 18) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "El CURP debe tener exactamente 18 caracteres.",
        });
    }

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
      return res
        .status(400)
        .json({
          status: "error",
          message: "El CURP ya se encuentra registrado.",
        });
    }
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
        status: "error",
        message: "Error al obtener los pacientes.",
        error: error.message,
      });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({
      where: { id, status: "active" },
    });

    if (!patient) {
      return res
        .status(404)
        .json({ status: "error", message: "Paciente no encontrado." });
    }
    res.status(200).json({ status: "success", data: patient });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error al obtener el paciente.",
        error: error.message,
      });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { curp, full_name, birth_date, gender } = req.body;

    const [updatedRows] = await Patient.update(
      { curp, full_name, birth_date, gender },
      { where: { id, status: "active" } },
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Paciente no encontrado o inactivo.",
        });
    }

    res
      .status(200)
      .json({
        status: "success",
        message: "Paciente actualizado exitosamente.",
      });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({
          status: "error",
          message: "El CURP ya está siendo usado por otro paciente.",
        });
    }
    res
      .status(500)
      .json({
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
      { status: "deleted" },
      { where: { id } },
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Paciente no encontrado." });
    }

    res
      .status(200)
      .json({
        status: "success",
        message: "Paciente eliminado correctamente.",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "error",
        message: "Error al eliminar el paciente.",
        error: error.message,
      });
  }
};
