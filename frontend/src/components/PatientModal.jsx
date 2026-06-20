import React, { useState } from "react";
import { X } from "lucide-react";

export const PatientModal = ({ isOpen, onClose, onSave }) => {
  // Estado inicial con los campos exactos de tu base de datos
  const [formData, setFormData] = useState({
    full_name: "",
    curp: "",
    gender: "",
    birth_date: "",
    status: "Activo", // Estatus por defecto
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si es la CURP, la convertimos automáticamente a mayúsculas
    setFormData({
      ...formData,
      [name]: name === "curp" ? value.toUpperCase() : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Validación rápida de longitud de CURP antes de mandar al Backend
    if (formData.curp.length !== 18) {
      setError("La CURP debe tener exactamente 18 caracteres.");
      setSubmitting(false);
      return;
    }

    try {
      // Hacemos el POST al endpoint de tu contenedor en Docker
      const response = await fetch("http://localhost:4000/api/v1/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_id: 1, // ID del usuario administrador asociado
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        onSave(); // Refresca la tabla de pacientes
        onClose(); // Cierra el modal
        setFormData({
          full_name: "",
          curp: "",
          gender: "",
          birth_date: "",
          status: "Activo",
        });
      } else {
        // Aquí SequelizeUniqueConstraintError va a mandar el mensaje si la CURP ya existe
        setError(result.message || "Error al registrar al paciente.");
      }
    } catch (err) {
      console.error("Error post patient:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden mx-4">
        {/* Encabezado del Modal */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Registrar Nuevo Paciente
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ingresa los datos oficiales del ciudadano.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Campo: Nombre Completo */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Nombre Completo
            </label>
            <input
              type="text"
              name="full_name"
              required
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez López"
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: CURP */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                CURP
              </label>
              <input
                type="text"
                name="curp"
                required
                maxLength={18}
                value={formData.curp}
                onChange={handleChange}
                placeholder="18 caracteres"
                className="w-full px-4 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700 uppercase"
              />
            </div>

            {/* Campo: Género */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Género
              </label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700"
              >
                <option value="">Selecciona...</option>
                <option value="M">Masculino (M)</option>
                <option value="F">Femenino (F)</option>
              </select>
            </div>
          </div>

          {/* Campo: Fecha de Nacimiento */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="birth_date"
              required
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700"
            />
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-colors text-sm disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Guardar Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
