import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export const PatientModal = ({ isOpen, onClose, onSave, patientData }) => {
  // Estado inicial con los campos limpios
  const [formData, setFormData] = useState({
    full_name: "",
    curp: "",
    gender: "",
    birth_date: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Efecto reactivo para alternar entre Modo Creación y Modo Edición
  useEffect(() => {
    if (patientData) {
      setFormData({
        full_name: patientData.full_name || "",
        curp: patientData.curp || "",
        gender: patientData.gender || "",
        birth_date: patientData.birth_date || "",
      });
    } else {
      setFormData({
        full_name: "",
        curp: "",
        gender: "",
        birth_date: "",
      });
    }
    setError("");
  }, [patientData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "curp" ? value.toUpperCase() : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (formData.curp.length !== 18) {
      setError("La CURP debe tener exactamente 18 caracteres.");
      setSubmitting(false);
      return;
    }

    try {
      const url = patientData
        ? `http://localhost:4000/api/v1/patients/${patientData.id}`
        : "http://localhost:4000/api/v1/patients";

      const method = patientData ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          curp: formData.curp,
          gender: formData.gender,
          birth_date: formData.birth_date,
          user_id: 1, // ID fijo para tus entornos locales de prueba
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        onSave();
        onClose();
      } else {
        setError(result.message || "Error al procesar la solicitud.");
      }
    } catch (err) {
      console.error("Error en el formulario de paciente:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden mx-4">
        {/* Encabezado del Modal Dinámico */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {patientData
                ? "Editar Perfil de Paciente"
                : "Registrar Nuevo Paciente"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {patientData
                ? "Modifica los datos oficiales del ciudadano."
                : "Ingresa los datos oficiales del ciudadano."}
            </p>
          </div>
          <button
            type="button"
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
                <option value="O">Otro (O)</option>
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
              {submitting
                ? "Guardando..."
                : patientData
                  ? "Guardar Cambios"
                  : "Guardar Paciente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
