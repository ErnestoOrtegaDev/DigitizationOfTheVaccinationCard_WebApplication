import React, { useEffect, useState } from "react";
import { Users, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { HealthCenterModal } from "../components/HealthCenterModal";
import Swal from "sweetalert2";
import { toast } from "sonner";

export const HealthCentersPage = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCenters = () => {
    setLoading(true);
    fetch("http://localhost:4000/api/v1/health-centers", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          setCenters(response.data || []);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching health centers:", error);
        setLoading(false);
      });
  };

  const handleEditClick = (id) => {
    fetch(`http://localhost:4000/api/v1/health-centers/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          setSelectedCenter(response.data);
          setIsModalOpen(true);
        }
      })
      .catch((error) => console.error("Error fetching single center:", error));
  };

  const handleSoftDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El centro de salud se marcará como inactivo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, inactivar",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:4000/api/v1/health-centers/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status === "success") {
              fetchCenters();
              toast.success("Centro de salud inactivado correctamente.");
            } else {
              toast.error(
                response.message || "No se pudo inactivar el centro.",
              );
            }
          })
          .catch((error) => {
            console.error("Error doing soft delete:", error);
            toast.error("Error de conexión con el servidor.");
          });
      }
    });
  };

  const filteredCenters = centers.filter((center) => {
    const term = searchTerm.toLowerCase();
    const name = center.name ? center.name.toLowerCase() : "";
    const clues = center.clues ? center.clues.toLowerCase() : "";
    return name.includes(term) || clues.includes(term);
  });

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="text-blue-900" size={28} />
            Centros de Salud
          </h1>
          <p className="text-slate-500 mt-1">
            Visualiza y administra los puntos médicos asignados a la cartilla
            digital.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCenter(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Nuevo Establecimiento</span>
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre o CLUES..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 focus:bg-white text-slate-700 placeholder-slate-400 transition-all"
          />
        </div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Resultados: {filteredCenters.length}
        </div>
      </div>

      {/* Grid de Cards */}
      {loading ? (
        <div className="p-14 text-center text-slate-500 font-medium">
          Cargando establecimientos médicos...
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="p-14 text-center text-slate-500 font-medium">
          No hay centros registrados que coincidan con la búsqueda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2">
                    {center.name}
                  </h3>
                  <span className="font-mono text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase shrink-0">
                    {center.clues}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-slate-600 pt-2">
                  <p>
                    <strong className="text-slate-400 text-xs uppercase block">
                      Dirección:
                    </strong>{" "}
                    {center.address}
                  </p>
                  <p>
                    <strong className="text-slate-400 text-xs uppercase block mt-1">
                      Teléfono:
                    </strong>{" "}
                    {center.phone || "Sin registro"}
                  </p>
                </div>
              </div>

              {/* Botones de acción al pie de la Card */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEditClick(center.id)}
                  className="text-slate-500 hover:text-blue-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all p-2 rounded-xl"
                  title="Editar Información"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleSoftDelete(center.id)}
                  className="text-slate-500 hover:text-red-600 hover:bg-white border border-transparent hover:border-red-100 transition-all p-2 rounded-xl"
                  title="Inactivar Establecimiento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <HealthCenterModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCenter(null);
        }}
        onSave={fetchCenters}
        centerData={selectedCenter}
      />
    </div>
  );
};
