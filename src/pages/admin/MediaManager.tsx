import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';

export function MediaManager() {
  const [data, setData] = useState({
    heroImage: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80',
    logoUrl: '',
    faviconUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const docSnap = await getDoc(doc(db, 'siteSettings', 'mediaAssets'));
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
      await setDoc(doc(db, 'siteSettings', 'mediaAssets'), data);
      setSuccessMsg('Media settings saved.');
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
           <h1 className="text-2xl font-bold tracking-tight">Media Assets</h1>
           <p className="text-sm text-slate-500">Manage images and branding used across the website.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0063CC] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Assets
        </button>
      </div>

      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium">{successMsg}</div>}

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><ImageIcon className="w-6 h-6 text-[#007AFF]" /> Image URLs</h2>
        <p className="text-sm text-slate-500 mb-6">Enter external image URLs (e.g. from Unsplash or your own hosting).</p>

        <div className="space-y-8">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Main Hero Image URL</label>
              <div className="flex flex-col sm:flex-row gap-4">
                 <input type="url" value={data.heroImage} onChange={e => setData({...data, heroImage: e.target.value})} className="flex-1 bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
                 {data.heroImage && (
                    <div className="w-32 h-20 rounded-xl overflow-hidden border border-[#E5E5EA]">
                       <img src={data.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                    </div>
                 )}
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Business Logo URL</label>
              <div className="flex flex-col sm:flex-row gap-4">
                 <input type="url" value={data.logoUrl} onChange={e => setData({...data, logoUrl: e.target.value})} className="flex-1 bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="Leave empty to display business name as text" />
                 {data.logoUrl && (
                    <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-[#E5E5EA] flex items-center justify-center p-2">
                       <img src={data.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
