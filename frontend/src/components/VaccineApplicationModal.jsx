import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from '../api/axios';
import { toast } from 'sonner';
import { useCartillaStore } from '../store/cartillaStore';

export const VaccineApplicationModal = ({ isOpen, onClose, recordId }) => {
    const [selectedCenterId, setSelectedCenterId] = useState('');
    const [healthCenters, setHealthCenters] = useState([]);
    const [loadingCenters, setLoadingCenters] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateVaccinationRecordStatus = useCartillaStore((state) => state.updateVaccinationRecordStatus);

    useEffect(() => {
        if (!isOpen) return;

        const fetchHealthCenters = async () => {
            setLoadingCenters(true);
            try {
                const response = await axios.get('/health-centers');
                if (response.data.status === 'success') {
                    setHealthCenters(response.data.data);
                }
            } catch (error) {
                console.error("Error al cargar centros de salud:", error);
                toast.error('Error al cargar centros de salud');
            } finally {
                setLoadingCenters(false);
            }
        };

        fetchHealthCenters();
    }, [isOpen]);

    const handleClose = () => {
        setSelectedCenterId('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCenterId) {
            toast.error('Por favor selecciona un centro de salud');
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.put(`/cartillas/record/${recordId}`, { 
                health_center_id: selectedCenterId 
            });
            
            // Actualizar el estado local del store al instante sin parpadeo
            updateVaccinationRecordStatus(recordId, 'applied');
            
            toast.success('Dosis registrada correctamente');
            handleClose();
        } catch (error) {
            console.error("Error al registrar:", error);
            toast.error(error.response?.data?.message || 'Error al registrar la aplicación');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Registrar Dosis</h2>
                        <p className="text-sm text-slate-500 mt-1">Selecciona el centro de salud donde se aplicará</p>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X size={20} className="text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Centro de Salud *
                        </label>
                        <select
                            value={selectedCenterId}
                            onChange={(e) => setSelectedCenterId(e.target.value)}
                            disabled={loadingCenters || isSubmitting}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                        >
                            <option value="">
                                {loadingCenters ? 'Cargando centros...' : 'Seleccionar centro de salud'}
                            </option>
                            {healthCenters.map((center) => (
                                <option key={center.id} value={center.id}>
                                    {center.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedCenterId}
                            className="flex-1 px-4 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Registrando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
