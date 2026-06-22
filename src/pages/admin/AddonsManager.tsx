import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Addon, Service } from '../../types';
import { Loader2, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export function AddonsManager() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Addon>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const servicesSnap = await getDocs(query(collection(db, 'services')));
      const servicesData = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
      setServices(servicesData);

      const addonsSnap = await getDocs(query(collection(db, 'addons')));
      const addonsData = addonsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Addon));
      setAddons(addonsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (addon: Addon) => {
    setEditingId(addon.id!);
    setFormData(addon);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      active: true,
      applicableServices: [],
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
    setError('');
  };

  const handleSave = async () => {
    if (!formData.name || formData.price === undefined || formData.price < 0) {
      setError('Please provide a valid name and price (cannot be negative).');
      return;
    }

    try {
      if (isAdding) {
        await addDoc(collection(db, 'addons'), formData as Addon);
      } else if (editingId) {
        await updateDoc(doc(db, 'addons', editingId), formData);
      }
      handleCancel();
      loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to save addon.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this add-on?')) return;
    try {
      await deleteDoc(doc(db, 'addons', id));
      loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete addon.');
    }
  };

  const toggleService = (serviceId: string) => {
    const current = formData.applicableServices || [];
    if (current.includes(serviceId)) {
      setFormData({ ...formData, applicableServices: current.filter(id => id !== serviceId) });
    } else {
      setFormData({ ...formData, applicableServices: [...current, serviceId] });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add-ons</h1>
          <p className="text-slate-500 mt-2">Manage optional extras like Ironing, Fast Turnaround, etc.</p>
        </div>
        <button onClick={handleAdd} disabled={isAdding || !!editingId} className="bg-[#1D1D1F] text-white px-5 py-2.5 rounded-full font-bold hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50">
          <Plus className="w-5 h-5" />
          Create Add-on
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium">{error}</div>}

      {(isAdding || editingId) && (
        <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6">{isAdding ? 'New Add-on' : 'Edit Add-on'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
              <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="e.g. Ironing (10 items)" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
              <input type="number" min="0" step="0.01" value={formData.price || 0} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none min-h-[100px]" placeholder="Add-on description..." />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-4">Applicable Services</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map(service => (
                  <button 
                    key={service.id}
                    onClick={() => toggleService(service.id!)}
                    className={`p-3 text-sm font-bold rounded-xl border text-left flex items-center justify-between transition-colors
                      ${(formData.applicableServices || []).includes(service.id!) ? 'border-[#007AFF] bg-blue-50 text-[#007AFF]' : 'border-[#E5E5EA] bg-white text-slate-600 hover:border-slate-300'}
                    `}
                  >
                     <span className="truncate">{service.name}</span>
                  </button>
                ))}
              </div>
              {(formData.applicableServices || []).length === 0 && (
                <p className="text-xs text-amber-600 mt-2">Warning: If no services are selected, this add-on won't appear during checkout.</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="active" checked={formData.active ?? true} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]" />
              <label htmlFor="active" className="font-bold text-slate-700">Active (Visible to customers)</label>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={handleCancel} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#0063CC] transition-colors">
              <Save className="w-5 h-5" />
              Save Add-on
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addons.map(addon => (
          <div key={addon.id} className={`bg-white p-6 rounded-[2rem] border transition-colors ${!addon.active ? 'border-dashed border-slate-300 py-6 opacity-75' : 'border-[#E5E5EA] shadow-sm hover:shadow-md'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                 <h3 className="font-bold text-lg text-[#1D1D1F] flex items-center gap-2">
                    {addon.name}
                    {!addon.active && <span className="bg-slate-200 text-slate-600 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold">Draft</span>}
                 </h3>
                 <div className="text-sm font-bold text-[#007AFF] mt-1">${addon.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(addon)} className="p-2 text-slate-400 hover:text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(addon.id!)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-6">{addon.description}</p>
            
            <div className="border-t border-slate-100 pt-4 mt-auto">
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Available for ({addon.applicableServices.length})</div>
               <div className="flex flex-wrap gap-2">
                  {addon.applicableServices.map(sid => {
                    const service = services.find(s => s.id === sid);
                    return service ? (
                       <span key={sid} className="bg-[#F5F5F7] text-slate-600 text-[11px] font-bold px-2 py-1 rounded-md">
                          {service.name}
                       </span>
                    ) : null;
                  })}
               </div>
            </div>
          </div>
        ))}
        {addons.length === 0 && !loading && (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-[2rem] border border-[#E5E5EA]">
            No add-ons created yet.
          </div>
        )}
      </div>
    </div>
  );
}
