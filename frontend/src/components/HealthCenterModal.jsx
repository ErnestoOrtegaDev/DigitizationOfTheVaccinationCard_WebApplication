import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

export const HealthCenterModal = ({ isOpen, onClose, onSave, centerData }) => {
  const [formData, setFormData] = useState({
    name: "",
    clues: "",
    address: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si nos pasan centerData (porque se dio clic en editar), llenamos el formulario
  useEffect(() => {
    if (centerData) {
      setFormData({
        name: centerData.name || "",
        clues: centerData.clues || "",
        address: centerData.address || "",
        phone: centerData.phone || "",
      });
    } else {
      // Si no hay datos, se limpia para un nuevo registro
      setFormData({ name: "", clues: "", address: "", phone: "" });
    }
  }, [centerData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Decidir si es edición (PUT) o creación (POST)
    const url = centerData
      ? `http://localhost:4000/api/v1/health-centers/${centerData.id}`
      : "http://localhost:4000/api/v1/health-centers";

    const method = centerData ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          toast.success(
            centerData
              ? "Centro de salud actualizado correctamente."
              : "Centro de salud registrado con éxito.",
          );
          onSave(); // Refresca la lista de tarjetas en la página principal
          onClose(); // Cierra el modal
        } else {
          toast.error(response.message || "Ocurrió un problema.");
        }
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Error saving health center:", error);
        toast.error("Error de conexión con el servidor.");
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {centerData
                ? "Editar Centro de Salud"
                : "Registrar Centro de Salud"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Completa la información oficial del punto de vacunación.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Nombre de la Clínica / Hospital *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Hospital Materno Infantil"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Clave CLUES *
              </label>
              <input
                type="text"
                name="clues"
                required
                value={formData.clues}
                onChange={handleChange}
                placeholder="Ej. MSDGO000234"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700 placeholder-slate-400 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10 dígitos"
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Dirección Completa *
            </label>
            <textarea
              name="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle, Número, Colonia, C.P. Durango, Dgo."
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Acciones del pie */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/60 text-white font-semibold py-2 px-5 rounded-xl text-sm transition-colors shadow-sm"
            >
              {isSubmitting ? "Guardando..." : "Guardar Centro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
