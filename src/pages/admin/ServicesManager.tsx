import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Service, PriceType } from '../../types';
import { Loader2, Plus, Edit2, Trash2, Save, X, GripVertical } from 'lucide-react';

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'services'), orderBy('displayOrder', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setServices(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id!);
    setFormData(service);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      priceType: 'per_bag',
      estimatedTurnaround: '24h',
      icon: 'Shirt',
      active: true,
      displayOrder: services.length,
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
    if (!formData.name || formData.basePrice === undefined || formData.basePrice < 0) {
      setError('Please provide a valid name and price (cannot be negative).');
      return;
    }

    try {
      if (isAdding) {
        await addDoc(collection(db, 'services'), formData as Service);
      } else if (editingId) {
        await updateDoc(doc(db, 'services', editingId), formData);
      }
      handleCancel();
      loadServices();
    } catch (err) {
      console.error(err);
      setError('Failed to save service.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      loadServices();
    } catch (err) {
      console.error(err);
      setError('Failed to delete service.');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await updateDoc(doc(db, 'services', service.id!), { active: !service.active });
      loadServices();
    } catch (err) {
      console.error(err);
      setError('Failed to update status.');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services & Pricing</h1>
          <p className="text-slate-500 mt-2">Manage your core offerings, prices, and turnaround times.</p>
        </div>
        <button onClick={handleAdd} disabled={isAdding || !!editingId} className="bg-[#1D1D1F] text-white px-5 py-2.5 rounded-full font-bold hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50">
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium">{error}</div>}

      {(isAdding || editingId) && (
        <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6">{isAdding ? 'New Service' : 'Edit Service'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Service Name</label>
              <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="e.g. Wash & Fold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Icon Name (Lucide React)</label>
              <input type="text" value={formData.icon || ''} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="e.g. Shirt" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none min-h-[100px]" placeholder="Service description..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Base Price ($)</label>
              <input type="number" min="0" step="0.01" value={formData.basePrice || 0} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Price Type</label>
              <select value={formData.priceType || 'per_bag'} onChange={e => setFormData({...formData, priceType: e.target.value as PriceType})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none">
                <option value="per_bag">Per Bag</option>
                <option value="per_item">Per Item</option>
                <option value="flat_fee">Flat Fee</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Turnaround</label>
              <input type="text" value={formData.estimatedTurnaround || ''} onChange={e => setFormData({...formData, estimatedTurnaround: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="e.g. 24h" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Display Order</label>
              <input type="number" min="0" value={formData.displayOrder || 0} onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value, 10)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
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
              Save Service
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-[#E5E5EA] overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No services created yet.</div>
        ) : (
          <ul className="divide-y divide-[#E5E5EA]">
            {services.map(service => (
              <li key={service.id} className="p-6 flex items-center gap-6 hover:bg-[#F5F5F7] transition-colors">
                <div className="cursor-move text-slate-300 hover:text-slate-500"><GripVertical className="w-6 h-6" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-lg text-[#1D1D1F]">{service.name}</h3>
                    {!service.active && <span className="bg-slate-200 text-slate-600 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-bold">Draft</span>}
                  </div>
                  <p className="text-slate-500 text-sm max-w-2xl">{service.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-[#1D1D1F]">${service.basePrice.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">{service.priceType.replace('_', ' ')}</div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => toggleActive(service)} className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border ${service.active ? 'border-amber-200 text-amber-700 hover:bg-amber-50' : 'border-green-200 text-green-700 hover:bg-green-50'}`}>
                    {service.active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => handleEdit(service)} className="p-2 text-slate-400 hover:text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                  <button onClick={() => handleDelete(service.id!)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
