// src/pages/VaccinesPage.jsx
import React, { useEffect, useState } from 'react';
import { Syringe, Plus, Pencil, Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'sonner';
import { useVaccineStore } from '../store/vaccineStore';
import { VaccineModal } from '../components/VaccineModal';

export const VaccinesPage = () => {
    const { vaccines, isLoading, fetchVaccines, deleteVaccine } = useVaccineStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVaccine, setSelectedVaccine] = useState(null);

    useEffect(() => {
        fetchVaccines();
    }, []);

    const filteredVaccines = vaccines.filter(v => 
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.disease_prevented.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (vaccine = null) => {
        setSelectedVaccine(vaccine);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Eliminar Vacuna?',
            text: "Esta acción removerá la vacuna del catálogo maestro.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e3a8a', 
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#ffffff',
            customClass: { popup: 'rounded-2xl' }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteVaccine(id);
                    toast.success('Vacuna eliminada del catálogo correctamente.');
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Error de conexión. No se pudo eliminar la vacuna.');
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
                            <Syringe size={28} />
                        </div>
                        Catálogo de Vacunas
                    </h1>
                    <p className="text-slate-500 mt-1 ml-14">Administra el esquema de vacunación oficial.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm transition-colors text-sm flex items-center gap-2"
                >
                    <Plus size={18} />
                    <span>Nueva Vacuna</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o enfermedad..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none transition-all placeholder-slate-400"
                        />
                    </div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        Total: {filteredVaccines.length} {filteredVaccines.length === 1 ? 'encontrada' : 'encontradas'}
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-14 text-center text-slate-500 font-medium">Cargando catálogo...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold text-xs uppercase tracking-wider">
                                    <th className="p-4 pl-6">Nombre de la Vacuna</th>
                                    <th className="p-4">Enfermedad que Previene</th>
                                    <th className="p-4">Vía de Administración</th>
                                    <th className="p-4 text-center pr-6">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                                {filteredVaccines.map((vaccine) => (
                                    <tr key={vaccine.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-4 pl-6 font-bold text-slate-800">{vaccine.name}</td>
                                        <td className="p-4 font-medium text-slate-600">{vaccine.disease_prevented}</td>
                                        <td className="p-4">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold border border-blue-100">
                                                {vaccine.administration_method}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center pr-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => openModal(vaccine)} 
                                                    className="text-slate-400 hover:text-blue-900 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="Editar Vacuna"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(vaccine.id)} 
                                                    className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar Vacuna"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredVaccines.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-slate-500">
                                            No se encontraron vacunas con esos criterios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <VaccineModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedVaccine(null);
                }} 
                vaccineData={selectedVaccine} 
            />
        </div>
    );
};