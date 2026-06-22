import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save, MapPin } from 'lucide-react';

export function ServiceAreaManager() {
  const [data, setData] = useState({
    radiusKm: 25,
    centreAddress: '123 Tauranga Crossing, Tauriko, Tauranga 3110',
    freeDeliveryRadiusKm: 15,
    outsideFeePerKm: 1.5,
    blockedSuburbs: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const docSnap = await getDoc(doc(db, 'siteSettings', 'serviceArea'));
        if (docSnap.exists()) {
          setData(docSnap.data() as any);
        }
      } catch (err) {
         console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'siteSettings', 'serviceArea'), data);
      setSuccessMsg('Service area settings updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-xl sticky top-4 z-10">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Service Area Rules</h1>
           <p className="text-sm text-slate-500">Configure delivery radius and fees.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0063CC] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium">{successMsg}</div>}

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#E5E5EA]">
           <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#007AFF]">
              <MapPin className="w-6 h-6" />
           </div>
           <div>
              <h2 className="text-xl font-bold">Operational Center</h2>
              <p className="text-slate-500 text-sm">Distances are calculated from this point.</p>
           </div>
        </div>

        <div className="space-y-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Base Address</label>
              <input type="text" value={data.centreAddress} onChange={e => setData({...data, centreAddress: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Maximum Service Radius (km)</label>
                 <input type="number" value={data.radiusKm} onChange={e => setData({...data, radiusKm: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
                 <p className="text-xs text-slate-500 mt-2">Customers beyond this distance cannot book.</p>
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Free Delivery Radius (km)</label>
                 <input type="number" value={data.freeDeliveryRadiusKm} onChange={e => setData({...data, freeDeliveryRadiusKm: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
                 <p className="text-xs text-slate-500 mt-2">Customers within this radius get free delivery.</p>
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Out-of-zone Fee ($ per km)</label>
                 <input type="number" step="0.5" value={data.outsideFeePerKm} onChange={e => setData({...data, outsideFeePerKm: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
                 <p className="text-xs text-slate-500 mt-2">Fee calculated for every km beyond the free radius.</p>
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Blocked / Excluded Suburbs</label>
              <textarea value={data.blockedSuburbs} onChange={e => setData({...data, blockedSuburbs: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none min-h-[100px]" placeholder="e.g. Matapihi, Kairua (comma separated)" />
              <p className="text-xs text-slate-500 mt-2">Addresses matching these keywords will be rejected.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
