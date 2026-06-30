import { create } from 'zustand';
import axios from '../api/axios';

export const useVaccineStore = create((set, get) => ({
    vaccines: [],
    isLoading: false,

    fetchVaccines: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get('/vaccines');
            if (response.data.status === 'success') {
                set({ vaccines: response.data.data });
            }
        } catch (error) {
            console.error('Error fetching vaccines:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    createVaccine: async (vaccineData) => {
        const response = await axios.post('/vaccines', vaccineData);
        await get().fetchVaccines(); // Refrescamos la lista
        return response.data;
    },

    updateVaccine: async (id, vaccineData) => {
        const response = await axios.put(`/vaccines/${id}`, vaccineData);
        await get().fetchVaccines();
        return response.data;
    },

    deleteVaccine: async (id) => {
        const response = await axios.delete(`/vaccines/${id}`);
        await get().fetchVaccines();
        return response.data;
    }
}));