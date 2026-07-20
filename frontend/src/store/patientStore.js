import { create } from "zustand";
import axios from "../api/axios";

export const usePatientStore = create((set) => ({
  patients: [],
  loading: false,

  // Recibe el ID del usuario logueado para hacer la consulta correcta mediante Axios
  fetchPatients: async (targetUserId) => {
    if (!targetUserId) return;
    set({ loading: true });
    try {
      const response = await axios.get(`/patients/user/${targetUserId}`);
      if (response.data?.status === "success") {
        set({ patients: response.data.data || [] });
      }
    } catch (error) {
      console.error("Error en store al traer pacientes:", error);
    } finally {
      set({ loading: false });
    }
  },
}));