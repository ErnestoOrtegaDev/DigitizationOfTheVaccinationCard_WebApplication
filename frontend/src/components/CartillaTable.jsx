import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { VaccineApplicationModal } from './VaccineApplicationModal';

export const CartillaTable = ({ records = [], patientId }) => {
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

    // Blindaje en la reducción: Si record.vaccine viene nulo, lo agrupa en "Otras Vacunas / General"
    const groupedRecords = records.reduce((acc, record) => {
        const vaccineName = record?.vaccine?.name || "Otras Vacunas / General";
        if (!acc[vaccineName]) acc[vaccineName] = [];
        acc[vaccineName].push(record);
        return acc;
    }, {});

    // Blindaje en las validaciones de dosis anteriores
    const canApplyDose = (record, allDosesOfVaccine) => {
        if (record?.status === 'applied') return true;

        const currentMonth = record?.scheme_dose?.apply_at_months || 0;
        const earlierDoses = allDosesOfVaccine.filter(
            dose => (dose?.scheme_dose?.apply_at_months || 0) < currentMonth
        );

        if (earlierDoses.length === 0) return true;

        return earlierDoses.every(dose => dose?.status === 'applied');
    };

    const getDisabledReason = (record, allDosesOfVaccine) => {
        if (record?.status === 'applied') return null;

        const currentMonth = record?.scheme_dose?.apply_at_months || 0;
        const earlierDoses = allDosesOfVaccine.filter(
            dose => (dose?.scheme_dose?.apply_at_months || 0) < currentMonth && dose?.status !== 'applied'
        );

        if (earlierDoses.length > 0) {
            return `Hay ${earlierDoses.length} dosis anterior(es) pendiente(s)`;
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Contenedor para habilitar el scroll horizontal en móviles */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-200">
                    <thead>
                        <tr className="bg-slate-800 text-white text-sm uppercase">
                            <th className="p-4 border-r border-slate-700 whitespace-nowrap">Vacuna</th>
                            <th className="p-4 border-r border-slate-700 whitespace-nowrap">Enfermedad</th>
                            <th className="p-4 border-r border-slate-700 whitespace-nowrap">Dosis</th>
                            <th className="p-4 border-r border-slate-700 whitespace-nowrap">Edad</th>
                            <th className="p-4 text-center whitespace-nowrap">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {Object.entries(groupedRecords).map(([vaccineName, doses]) => (
                            doses.map((record, index) => (
                                <tr key={record.id} className="hover:bg-slate-50">
                                    {index === 0 && (
                                        <td rowSpan={doses.length} className="p-4 font-bold border-r border-slate-200 bg-slate-50/50 align-middle whitespace-nowrap">
                                            {vaccineName}
                                        </td>
                                    )}
                                    {index === 0 && (
                                        <td rowSpan={doses.length} className="p-4 text-sm text-slate-600 border-r border-slate-200 align-middle">
                                            {record?.vaccine?.disease_prevented || "Preventiva general"}
                                        </td>
                                    )}
                                    <td className="p-4 text-sm border-r border-slate-200 whitespace-nowrap">
                                        {record?.scheme_dose?.dose_name || "Dosis general / Única"}
                                    </td>
                                    <td className="p-4 text-sm border-r border-slate-200 whitespace-nowrap">
                                        {record?.scheme_dose?.apply_at_months !== undefined ? `${record.scheme_dose.apply_at_months} meses` : "N/A"}
                                    </td>
                                    <td className="p-4 text-center">
                                        {record?.status === 'applied' ? (
                                            <span className="text-green-600 font-bold flex justify-center items-center gap-1 whitespace-nowrap">
                                                <CheckCircle size={18} /> Aplicada
                                            </span>
                                        ) : (
                                            <div className="relative group inline-block">
                                                <button
                                                    onClick={() => handleApplyVaccine(record.id)}
                                                    disabled={!canApplyDose(record, doses)}
                                                    className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                                                    title={getDisabledReason(record, doses) || 'Registrar Dosis'}
                                                >
                                                    Registrar Dosis
                                                </button>
                                                {getDisabledReason(record, doses) && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
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
            </div>

            {/* Modal de Registro */}
            <VaccineApplicationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                recordId={selectedRecordId}
            />
        </div>
    );
};