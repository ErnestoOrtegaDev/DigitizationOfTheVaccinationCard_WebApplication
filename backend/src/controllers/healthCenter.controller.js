import HealthCenter from "../models/healthCenter.model.js";
import { encodeId, decodeId } from "../utils/hashids.js";

export const createHealthCenter = async (req, res) => {
  try {
    const { name, clues, address, phone } = req.body;
    if (!name || !clues || !address) {
      return res.status(400).json({
        status: "error",
        message: "Los campos Nombre, CLUES y Dirección son obligatorios.",
      });
    }

    const newCenter = await HealthCenter.create({
      name,
      clues,
      address,
      phone: phone || null,
    });

    res.status(201).json({
      status: "success",
      message: "Centro de salud registrado exitosamente.",
      data: {
        centerId: encodeId(newCenter.id),
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: "error",
        message: "La clave CLUES ya se encuentra registrada en otro centro.",
      });
    }
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.errors[0].message,
      });
    }

    console.error("[HealthCenter Controller] Error al crear centro:", error);
    res.status(500).json({
      status: "error",
      message: "Error al crear el centro de salud.",
      error: error.message,
    });
  }
};

export const getActiveHealthCenters = async (req, res) => {
  try {
    const centers = await HealthCenter.findAll({
      where: { status: "active" },
    });
    const obfuscatedCenters = centers.map((c) => {
      const data = c.toJSON();
      data.id = encodeId(data.id);
      return data;
    });

    res.status(200).json({ status: "success", data: obfuscatedCenters });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener los centros de salud activos.",
      error: error.message,
    });
  }
};

export const getHealthCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const realCenterId = decodeId(id);
    if (!realCenterId) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de centro de salud no válido." });
    }

    const center = await HealthCenter.findByPk(realCenterId);
    if (!center) {
      return res
        .status(404)
        .json({ status: "error", message: "Centro de salud no encontrado." });
    }
    const data = center.toJSON();
    data.id = encodeId(data.id);
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el centro de salud.",
      error: error.message,
    });
  }
};

export const updateHealthCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, clues, address, phone, status } = req.body;
    const realCenterId = decodeId(id);

    if (!realCenterId) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de centro de salud no válido." });
    }

    const center = await HealthCenter.findByPk(realCenterId);

    if (!center) {
      return res.status(404).json({
        status: "error",
        message: "Centro de salud no encontrado.",
      });
    }

    await center.update({ name, clues, address, phone, status });

    res.status(200).json({
      status: "success",
      message: "Centro de salud actualizado exitosamente.",
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        status: "error",
        message: "La clave CLUES ya está siendo usada por otro centro.",
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
      message: "Error al actualizar el centro de salud.",
      error: error.message,
    });
  }
};

export const deleteHealthCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const realCenterId = decodeId(id);

    if (!realCenterId) {
      return res
        .status(400)
        .json({ status: "error", message: "ID de centro de salud no válido." });
    }

    const [updatedRows] = await HealthCenter.update(
      { status: "inactive" },
      { where: { id: realCenterId } },
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Centro de salud no encontrado." });
    }

    res.status(200).json({
      status: "success",
      message: "Centro de salud marcado como inactivo correctamente.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al cambiar el estado del centro de salud.",
      error: error.message,
    });
  }
};
