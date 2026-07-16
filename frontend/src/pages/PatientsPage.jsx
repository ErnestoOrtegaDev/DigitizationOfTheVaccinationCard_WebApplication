import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";
import { PatientModal } from "../components/PatientModal";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { usePatientStore } from "../store/patientStore";
import { Link } from "react-router-dom";

export const PatientsPage = () => {
  const { patients, loading, fetchPatients } = usePatientStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useAuthStore((state) => state.user);
  const normalizedRole = (currentUser?.role || "citizen").toLowerCase();
  const canCreatePatients =
    normalizedRole === "admin" ||
    normalizedRole === "nurse" ||
    normalizedRole === "citizen";
  const canEditOrDeletePatients =
    normalizedRole === "admin" || normalizedRole === "nurse";

  const handleEditClick = (id) => {
    fetch(`http://localhost:4000/api/v1/patients/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === "success") {
          setSelectedPatient(response.data);
          setIsModalOpen(true);
        }
      })
      .catch((error) => console.error("Error fetching single patient:", error));
  };

  const handleSoftDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El paciente se eliminará del sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:4000/api/v1/patients/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: "inactive" }),
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.status === "success") {
              fetchPatients(currentUser?.id || "1");
              toast.success("Paciente eliminado correctamente.");
            } else {
              toast.error(
                response.message || "No se pudo eliminar el paciente.",
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

  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const fullName = patient.full_name ? patient.full_name.toLowerCase() : "";
    const curp = patient.curp ? patient.curp.toLowerCase() : "";
    return fullName.includes(term) || curp.includes(term);
  });

  useEffect(() => {
    const targetUserId = currentUser?.id || "1";
    fetchPatients(targetUserId);
  }, [currentUser?.id]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="text-blue-900" size={28} />
            Pacientes Registrados
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona y revisa los perfiles de vacunación asignados a tu cuenta.
          </p>
        </div>
        {canCreatePatients && (
          <button
            onClick={() => {
              setSelectedPatient(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm flex items-center gap-2"
          >
            <UserPlus size={18} />
            <span>Nuevo Registro</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar paciente o CURP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700 placeholder-slate-400"
            />
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Total: {filteredPatients.length}{" "}
            {filteredPatients.length === 1 ? "encontrado" : "encontrados"}
          </div>
        </div>

        {loading ? (
          <div className="p-14 text-center text-slate-500 font-medium">
            Cargando pacientes del sistema...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-14 text-center text-slate-500 font-medium">
            No se encontraron pacientes registrados con esos criterios.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6">Nombre Completo</th>
                  <th className="p-4">CURP</th>
                  <th className="p-4 text-center">Género</th>
                  <th className="p-4">Fecha de Nacimiento</th>
                  <th className="p-4 text-center">Estatus</th>
                  <th className="p-4 text-center pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-4 pl-6 font-semibold text-slate-800">
                      {patient.full_name}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-slate-500 bg-slate-50/40 px-2 py-1 rounded-md">
                        {patient.curp}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          patient.gender === "M"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-pink-50 text-pink-700 border border-pink-100"
                        }`}
                      >
                        {patient.gender}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">
                      {patient.birth_date}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-bold tracking-wide uppercase shadow-sm ${
                          patient.status === "inactive" ||
                          patient.status === "inactivo"
                            ? "bg-slate-400"
                            : "bg-green-600"
                        }`}
                      >
                        {patient.status === "active" ||
                        patient.status === "ACTIVE" ||
                        !patient.status
                          ? "Activo"
                          : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-4 text-center pr-6">
                      <div className="flex items-center justify-center gap-3">
                        {canEditOrDeletePatients && (
                          <>
                            <button
                              onClick={() => handleEditClick(patient.id)}
                              className="text-slate-400 hover:text-blue-900 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                              title="Editar Cartilla"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleSoftDelete(patient.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                              title="Eliminar Paciente"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/cartilla/${patient.id}`}
                          className="text-slate-400 hover:text-blue-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Ver Cartilla"
                        >
                          <FileText size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
        onSave={() => fetchPatients(currentUser?.id || "1")}
        patientData={selectedPatient}
      />
    </div>
  );
};
