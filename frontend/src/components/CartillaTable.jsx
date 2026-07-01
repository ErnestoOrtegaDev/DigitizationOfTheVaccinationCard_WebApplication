import React, { useState, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { VaccineApplicationModal } from './VaccineApplicationModal';

export const CartillaTable = ({ records, patientId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);

    const handleApplyVaccine = (recordId) => {
        setSelectedRecordId(recordId);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedRecordId(null);
    };

    const groupedRecords = records.reduce((acc, record) => {
        const vaccineName = record.vaccine.name;
        if (!acc[vaccineName]) acc[vaccineName] = [];
        acc[vaccineName].push(record);
        return acc;
    }, {});

    const canApplyDose = (record, allDosesOfVaccine) => {
        // Si ya está aplicada, siempre puede verse
        if (record.status === 'applied') return true;
        
        // Obtener las dosis anteriores (menor edad de aplicación)
        const currentMonth = record.scheme_dose.apply_at_months;
        const earlierDoses = allDosesOfVaccine.filter(
            dose => dose.scheme_dose.apply_at_months < currentMonth
        );

        // Si no hay dosis anteriores, puede aplicarse
        if (earlierDoses.length === 0) return true;

        // Verificar si todas las dosis anteriores están aplicadas
        return earlierDoses.every(dose => dose.status === 'applied');
    };

    const getDisabledReason = (record, allDosesOfVaccine) => {
        if (record.status === 'applied') return null;
        
        const currentMonth = record.scheme_dose.apply_at_months;
        const earlierDoses = allDosesOfVaccine.filter(
            dose => dose.scheme_dose.apply_at_months < currentMonth && dose.status !== 'applied'
        );

        if (earlierDoses.length > 0) {
            return `Hay ${earlierDoses.length} dosis anterior(es) pendiente(s)`;
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-800 text-white text-sm uppercase">
                        <th className="p-4 border-r border-slate-700">Vacuna</th>
                        <th className="p-4 border-r border-slate-700">Enfermedad</th>
                        <th className="p-4 border-r border-slate-700">Dosis</th>
                        <th className="p-4 border-r border-slate-700">Edad</th>
                        <th className="p-4 text-center">Acción</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {Object.entries(groupedRecords).map(([vaccineName, doses]) => (
                        doses.map((record, index) => (
                            <tr key={record.id} className="hover:bg-slate-50">
                                {index === 0 && (
                                    <td rowSpan={doses.length} className="p-4 font-bold border-r border-slate-200 bg-slate-50/50 align-middle">
                                        {vaccineName}
                                    </td>
                                )}
                                {index === 0 && (
                                    <td rowSpan={doses.length} className="p-4 text-sm text-slate-600 border-r border-slate-200 align-middle">
                                        {record.vaccine.disease_prevented}
                                    </td>
                                )}
                                <td className="p-4 text-sm border-r border-slate-200">{record.scheme_dose.dose_name}</td>
                                <td className="p-4 text-sm border-r border-slate-200">{record.scheme_dose.apply_at_months} meses</td>
                                <td className="p-4 text-center">
                                    {record.status === 'applied' ? (
                                        <span className="text-green-600 font-bold flex justify-center items-center gap-1">
                                            <CheckCircle size={18} /> Aplicada
                                        </span>
                                    ) : (
                                        <div className="relative group">
                                            <button 
                                                onClick={() => handleApplyVaccine(record.id)} 
                                                disabled={!canApplyDose(record, doses)}
                                                className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                                                title={getDisabledReason(record, doses) || 'Registrar Dosis'}
                                            >
                                                Registrar Dosis
                                            </button>
                                            {getDisabledReason(record, doses) && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {getDisabledReason(record, doses)}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>

            {/* Modal de Registro */}
            <VaccineApplicationModal 
                isOpen={isModalOpen}
                onClose={handleModalClose}
                recordId={selectedRecordId}
            />
        </div>
    );
};