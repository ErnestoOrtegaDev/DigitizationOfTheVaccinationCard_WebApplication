import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCartillaStore } from '../store/cartillaStore';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { CartillaTable } from '../components/CartillaTable';

export const CartillaPage = () => {
    const { patientId } = useParams();
    const { cartilla, cartillaInfo, isLoading, fetchPatientCartilla } = useCartillaStore();

    useEffect(() => {
        if (patientId) {
            console.log('Cargando cartilla para paciente:', patientId);
            fetchPatientCartilla(patientId);
        }
    }, [patientId]);

    if (isLoading) return <div className="text-center p-10">Cargando esquema de vacunación...</div>;

    return (
        <main className="p-6">
            {cartilla && cartilla.length > 0 ? (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Esquema de Vacunación</h1>
                    </div>
                    <CartillaTable records={cartilla} patientId={patientId} />
                </>
            ) : (
                <div className="p-6 bg-white rounded-lg border border-slate-200">
                    <p className="text-slate-600">No hay esquema disponible para esta edad.</p>
                </div>
            )}
        </main>
    );
};
