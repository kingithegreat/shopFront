import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PromoCode, Service } from '../../types';
import { Loader2, Plus, Edit2, Trash2, Save, Tag } from 'lucide-react';

export function PromoCodesManager() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<PromoCode>>({});
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

      const codesSnap = await getDocs(query(collection(db, 'promoCodes')));
      const codesData = codesSnap.docs.map(d => ({ id: d.id, ...d.data() } as PromoCode));
      setPromoCodes(codesData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (code: PromoCode) => {
    setEditingId(code.id!);
    setFormData(code);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      code: '',
      discountType: 'percent',
      discountValue: 10,
      expiryDate: '',
      usageLimit: 100,
      timesUsed: 0,
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
    if (!formData.code || formData.discountValue === undefined || formData.discountValue <= 0) {
      setError('Please provide a valid code and discount value.');
      return;
    }
    
    const duplicate = promoCodes.find(p => p.code.toUpperCase() === formData.code?.toUpperCase() && p.id !== editingId);
    if (duplicate) {
      setError('A promo code with this name already exists.');
      return;
    }

    try {
      const payload = { ...formData, code: formData.code.toUpperCase() } as PromoCode;
      
      if (isAdding) {
        await addDoc(collection(db, 'promoCodes'), payload);
      } else if (editingId) {
        await updateDoc(doc(db, 'promoCodes', editingId), payload as any);
      }
      handleCancel();
      loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to save promo code.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this promo code?')) return;
    try {
      await deleteDoc(doc(db, 'promoCodes', id));
      loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete.');
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
          <h1 className="text-3xl font-bold tracking-tight">Promo Codes</h1>
          <p className="text-slate-500 mt-2">Create and manage discount codes for your customers.</p>
        </div>
        <button onClick={handleAdd} disabled={isAdding || !!editingId} className="bg-[#1D1D1F] text-white px-5 py-2.5 rounded-full font-bold hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-50">
          <Plus className="w-5 h-5" />
          Create Code
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium">{error}</div>}

      {(isAdding || editingId) && (
        <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-6">{isAdding ? 'New Promo Code' : 'Edit Promo Code'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Code Name</label>
              <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none uppercase font-bold" placeholder="e.g. SUMMER20" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                <select value={formData.discountType || 'percent'} onChange={e => setFormData({...formData, discountType: e.target.value as any})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none">
                  <option value="percent">% Percent</option>
                  <option value="fixed">$ Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Value</label>
                <input type="number" min="0" step={formData.discountType === 'percent' ? '1' : '0.01'} value={formData.discountValue || 0} onChange={e => setFormData({...formData, discountValue: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Expiry Date</label>
              <input type="date" value={formData.expiryDate || ''} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Usage Limit</label>
              <input type="number" min="0" value={formData.usageLimit || 0} onChange={e => setFormData({...formData, usageLimit: parseInt(e.target.value, 10)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="0 for unlimited" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-4">Applicable Services (Empty = All Services)</label>
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
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="active" checked={formData.active ?? true} onChange={e => setFormData({...formData, active: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]" />
              <label htmlFor="active" className="font-bold text-slate-700">Active (Can be used by customers)</label>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={handleCancel} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-full transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#0063CC] transition-colors">
              <Save className="w-5 h-5" />
              Save Code
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] border border-[#E5E5EA] overflow-hidden">
        {promoCodes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No promo codes created yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-[#F5F5F7] border-b border-[#E5E5EA]">
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Code</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Discount</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Usage</th>
                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                   <th className="px-6 py-4 text-right"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#E5E5EA]">
                {promoCodes.map(code => {
                  const isExpired = code.expiryDate && new Date(code.expiryDate) < new Date();
                  const isExhausted = code.usageLimit > 0 && code.timesUsed >= code.usageLimit;
                  const isActive = code.active && !isExpired && !isExhausted;

                  return (
                    <tr key={code.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4">
                          <div className="font-mono font-bold text-[#1D1D1F] bg-slate-100 inline-block px-2 py-1 rounded">{code.code}</div>
                       </td>
                       <td className="px-6 py-4 font-bold text-[#1D1D1F]">
                          {code.discountType === 'percent' ? `${code.discountValue}% Off` : `$${code.discountValue.toFixed(2)} Off`}
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-500">
                          {code.timesUsed} / {code.usageLimit === 0 ? '∞' : code.usageLimit}
                       </td>
                       <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                             isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isActive ? 'Active' : isExpired ? 'Expired' : isExhausted ? 'Exhausted' : 'Disabled'}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button onClick={() => handleEdit(code)} className="p-2 text-slate-400 hover:text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete(code.id!)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                       </td>
                    </tr>
                  )
                })}
             </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
