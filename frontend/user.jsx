import React, { useEffect, useState } from "react";
import { Users, UserPlus, Search, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import axios from "./src/api/axios.js"; 
import { useAuthStore } from "./src/store/authStore";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = useAuthStore((state) => state.user);

  // 1. Obtener todos los usuarios activos (Sincronizado con tu router.get("/"))
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 🔽 Modificado para que llame a la ruta raíz "/" de usuarios en tu backend
      const response = await axios.get("/users");
      
      if (response.data.status === "success" || response.data) {
        setUsers(response.data.data || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("No se pudieron cargar los usuarios o no tienes permisos.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Crear nuevo usuario (Sincronizado con tu router.post("/"))
  const handleCreateUser = async () => {
    Swal.fire({
      title: "Crear Nuevo Usuario",
      text: "Se creará un usuario con contraseña por defecto.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Generar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 🔽 Llama a tu post "/"
          await axios.post("/users", { role: "citizen" });
          toast.success("Usuario creado con contraseña temporal.");
          fetchUsers();
        } catch (error) {
          toast.error("Error al crear el usuario administrativo.");
        }
      }
    });
  };

  // 3. Eliminar lógicamente un usuario (Sincronizado con tu router.delete("/delete/:id"))
  const handleSoftDelete = (id) => {
    Swal.fire({
      title: "¿Inactivar Usuario?",
      text: "El usuario perderá acceso al sistema temporalmente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, inactivar",
      cancelButtonText: "Cancelar",
      customClass: { popup: "rounded-2xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 🔽 Llama a tu delete exacto "/delete/:id"
          const response = await axios.delete(`/users/delete/${id}`);
          if (response.data.status === "success" || response.status === 200) {
            fetchUsers();
            toast.success("Usuario marcado como inactivo correctamente.");
          }
        } catch (error) {
          console.error("Error doing soft delete:", error);
          toast.error("Hubo un problema al cambiar el estatus del usuario.");
        }
      }
    });
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const email = user.email ? user.email.toLowerCase() : "";
    const role = user.role ? user.role.toLowerCase() : "";
    return email.includes(term) || role.includes(term);
  });

  useEffect(() => {
    fetchUsers();
  }, [currentUser?.id]);

  return (
    <div className="space-y-6">
      {/* Encabezado Principal */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <Users className="text-blue-900" size={28} />
            Control de Usuarios del Sistema
          </h1>
          <p className="text-slate-500 mt-1">
            Visualiza, añade y gestiona los roles y accesos globales de VacunApp MX.
          </p>
        </div>
        <button
          onClick={handleCreateUser}
          className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm transition-colors text-sm flex items-center gap-2"
        >
          <UserPlus size={18} />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Buscar por correo o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-900 text-slate-700 placeholder-slate-400"
            />
          </div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Total: {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "usuario" : "usuarios"}
          </div>
        </div>

        {loading ? (
          <div className="p-14 text-center text-slate-500 font-medium">
            Cargando el padrón de usuarios...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-14 text-center text-slate-500 font-medium">
            No se encontraron cuentas activas con esos criterios.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  <th className="p-4 pl-6">ID Cuenta</th>
                  <th className="p-4">Correo Electrónico</th>
                  <th className="p-4 text-center">Rol de Accesos</th>
                  <th className="p-4 text-center">Estatus</th>
                  <th className="p-4 text-center pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-mono text-xs text-slate-400">
                      #{user.id}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {user.email}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : "bg-blue-50 text-blue-700 border border-blue-100"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-green-600 px-3 py-1 rounded-full text-white text-xs font-bold tracking-wide uppercase shadow-sm">
                        {user.status || "active"}
                      </span>
                    </td>
                    <td className="p-4 text-center pr-6">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          className="text-slate-400 hover:text-blue-900 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
                          title="Modificar Permisos"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleSoftDelete(user.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                          title="Dar de baja temporal"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};