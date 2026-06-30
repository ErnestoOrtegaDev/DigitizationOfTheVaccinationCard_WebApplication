// src/components/VaccineModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useVaccineStore } from '../store/vaccineStore';

export const VaccineModal = ({ isOpen, onClose, vaccineData }) => {
    const { createVaccine, updateVaccine } = useVaccineStore();
    const [formData, setFormData] = useState({ name: '', disease_prevented: '', administration_method: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (vaccineData) {
            setFormData({
                name: vaccineData.name || '',
                disease_prevented: vaccineData.disease_prevented || '',
                administration_method: vaccineData.administration_method || ''
            });
        } else {
            setFormData({ name: '', disease_prevented: '', administration_method: '' });
        }
    }, [vaccineData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (vaccineData) {
                await updateVaccine(vaccineData.id, formData);
                toast.success('Vacuna actualizada correctamente.');
            } else {
                await createVaccine(formData);
                toast.success('Vacuna agregada al catálogo.');
            }
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'No se pudo guardar la información de la vacuna.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md mx-4 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {vaccineData ? 'Editar Vacuna' : 'Nueva Vacuna'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {vaccineData ? 'Modifica los datos del biológico.' : 'Añade un biológico al catálogo oficial.'}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Nombre</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            required 
                            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" 
                            placeholder="Ej. BCG" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Enfermedad que previene</label>
                        <input 
                            type="text" 
                            value={formData.disease_prevented} 
                            onChange={(e) => setFormData({...formData, disease_prevented: e.target.value})} 
                            required 
                            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" 
                            placeholder="Ej. Tuberculosis" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Método de Administración</label>
                        <input 
                            type="text" 
                            value={formData.administration_method} 
                            onChange={(e) => setFormData({...formData, administration_method: e.target.value})} 
                            required 
                            className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none" 
                            placeholder="Ej. Intradérmica" 
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-xl shadow-sm transition-colors text-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};