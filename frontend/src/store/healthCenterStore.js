import { create } from "zustand";

export const useHealthCenterStore = create((set) => ({
  centers: [],
  loading: false,

  // Petición para llenar el store con los centros del backend
  fetchCenters: async () => {
    set({ loading: true });
    try {
      const res = await fetch("http://localhost:4000/api/v1/health-centers", {
        credentials: "include",
      });
      const response = await res.json();
      if (response.status === "success") {
        set({ centers: response.data || [] });
      }
    } catch (error) {
      console.error("Error en store al traer centros:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
