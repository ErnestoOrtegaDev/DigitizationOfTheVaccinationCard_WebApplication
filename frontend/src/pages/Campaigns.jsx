import React, { useState } from "react";
import { Megaphone, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";

const MOCK_DATA = {
  "Durango": ["Durango", "Gómez Palacio", "Lerdo"],
  "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque"],
  "Ciudad de México": ["Benito Juárez", "Cuauhtémoc", "Iztapalapa"],
  "Nuevo León": ["Monterrey", "San Pedro", "Guadalupe"]
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="text-orange-500 mb-4 text-5xl">!</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300">Cancelar</button>
          <button onClick={onConfirm} className="px-6 py-2 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800">Sí, eliminar</button>
        </div>
      </div>
    </div>
  );
};

const CampaignModal = ({ isOpen, onClose, onSave, campaignData, setCampaignData }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-5">{campaignData?.id ? "Editar Campaña" : "Nueva Campaña"}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre</label>
            <input className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl" value={campaignData?.name || ""} onChange={(e) => setCampaignData({...campaignData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select className="w-full p-2.5 border border-slate-200 rounded-xl" value={campaignData?.ciudad || ""} onChange={(e) => setCampaignData({...campaignData, ciudad: e.target.value, localidad: ""})}>
              <option value="">Seleccionar Estado</option>
              {Object.keys(MOCK_DATA).map(estado => <option key={estado} value={estado}>{estado}</option>)}
            </select>
            <select className="w-full p-2.5 border border-slate-200 rounded-xl" value={campaignData?.localidad || ""} onChange={(e) => setCampaignData({...campaignData, localidad: e.target.value})}>
              <option value="">Localidad</option>
              {(MOCK_DATA[campaignData?.ciudad] || []).map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Brotes</label>
            <input 
              className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl" 
              placeholder="ej. Influenza" 
              value={campaignData?.brotes || ""} 
              onChange={(e) => setCampaignData({...campaignData, brotes: e.target.value})} 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Ubicación</label>
            <input className="w-full mt-1 p-2.5 border border-slate-200 rounded-xl" value={campaignData?.ubicacion || ""} onChange={(e) => setCampaignData({...campaignData, ubicacion: e.target.value})} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl">Cancelar</button>
          <button onClick={onSave} className="px-4 py-2 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export const Campaigns = () => {
  const [campanas, setCampanas] = useState([{ id: 1, name: "Sarampión", ciudad: "Durango", localidad: "Durango", brotes: "15", ubicacion: "Av. Principal 123" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [filterCiudad, setFilterCiudad] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const handleSave = () => {
    if (formData.id) {
      setCampanas(campanas.map(c => c.id === formData.id ? formData : c));
      toast.success("Campaña actualizada");
    } else {
      setCampanas([...campanas, { ...formData, id: Date.now() }]);
      toast.success("Campaña registrada");
    }
    setIsModalOpen(false);
    setFormData(null);
  };

  const handleDelete = () => {
    setCampanas(campanas.filter(c => c.id !== deleteId));
    toast.success("Campaña eliminada");
    setDeleteId(null);
  };

  const filteredCampanas = campanas.filter(c => 
    (filterCiudad === "" || c.ciudad === filterCiudad) &&
    (filterLocalidad === "" || c.localidad === filterLocalidad)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Megaphone className="text-blue-900" size={28} /> Gestión de Campañas
        </h1>
        <button onClick={() => { setFormData({}); setIsModalOpen(true); }} className="bg-blue-900 text-white py-2.5 px-4 rounded-xl text-sm flex items-center gap-2 hover:bg-blue-800">
          <Plus size={18} /> Nueva Campaña
        </button>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
        <Filter className="text-slate-400" size={20} />
        <select className="p-2 bg-white border border-slate-200 rounded-xl outline-none" onChange={(e) => { setFilterCiudad(e.target.value); setFilterLocalidad(""); }}>
          <option value="">Filtrar por Estado</option>
          {Object.keys(MOCK_DATA).map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select className="p-2 bg-white border border-slate-200 rounded-xl outline-none" onChange={(e) => setFilterLocalidad(e.target.value)}>
          <option value="">Filtrar por Localidad</option>
          {(MOCK_DATA[filterCiudad] || []).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCampanas.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800">{c.name}</h3>
              <p className="text-xs text-blue-900 font-bold uppercase mt-1">{c.ciudad} • {c.localidad}</p>
              <p className="text-sm text-slate-600 mt-2">Brotes: {c.brotes}</p>
              <p className="text-sm text-slate-500">{c.ubicacion}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
              <button onClick={() => { setFormData(c); setIsModalOpen(true); }} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-900"><Pencil size={16} /></button>
              <button onClick={() => setDeleteId(c.id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <CampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} campaignData={formData} setCampaignData={setFormData} />
      
      <ConfirmModal 
        isOpen={deleteId !== null} 
        onClose={() => setDeleteId(null)} 
        onConfirm={handleDelete}
        title="¿Eliminar Campaña?"
        message="Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta campaña?"
      />
    </div>
  );
};