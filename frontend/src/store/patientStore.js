import { create } from "zustand";

export const usePatientStore = create((set) => ({
  patients: [],
  loading: false,

  // Recibe el ID del usuario logueado para hacer la consulta correcta
  fetchPatients: async (targetUserId) => {
    if (!targetUserId) return;
    set({ loading: true });
    try {
      const res = await fetch(
        `http://localhost:4000/api/v1/patients/user/${targetUserId}`,
        {
          credentials: "include",
        },
      );
      const response = await res.json();
      if (response.status === "success") {
        set({ patients: response.data || [] });
      }
    } catch (error) {
      console.error("Error en store al traer pacientes:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
