import { create } from 'zustand';
import axios from '../api/axios';

export const useCartillaStore = create((set, get) => ({
    cartilla: null,
    cartillaInfo: null,
    isLoading: false,
    lastPatientId: null,

    fetchPatientCartilla: async (patientId) => {
        const state = get();
        
        // Si es el mismo paciente y ya tenemos datos, no volver a cargar
        if (state.lastPatientId === patientId && state.cartilla !== null) {
            return;
        }

        // Reset del estado anterior
        set({ isLoading: true, cartilla: null, cartillaInfo: null, lastPatientId: patientId });

        try {
            const response = await axios.get(`/cartillas/patient/${patientId}`);
            set({ 
                cartilla: response.data.data || [], 
                cartillaInfo: response.data.cartilla_info,
                isLoading: false,
                lastPatientId: patientId
            });
        } catch (error) {
            console.error('Error fetching cartilla:', error);
            set({ isLoading: false, cartilla: [], cartillaInfo: null, lastPatientId: patientId });
        }
    },

    updateVaccinationRecordStatus: (recordId, newStatus) => {
        set((state) => {
            if (!state.cartilla || state.cartilla.length === 0) return state;
            const updatedCartilla = state.cartilla.map(record =>
                record.id === recordId ? { ...record, status: newStatus } : record
            );
            return { cartilla: updatedCartilla };
        });
    }
}));
        