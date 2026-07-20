import { create } from "zustand";
import axios from "../api/axios";

export const useHealthCenterStore = create((set) => ({
  centers: [],
  loading: false,

  // Petición para llenar el store con los centros del backend utilizando la instancia de Axios
  fetchCenters: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/health-centers");
      if (response.data?.status === "success") {
        set({ centers: response.data.data || [] });
      }
    } catch (error) {
      console.error("Error en store al traer centros:", error);
    } finally {
      set({ loading: false });
    }
  },
}));