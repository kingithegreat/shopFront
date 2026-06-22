import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save } from 'lucide-react';

export function WebsiteEditor() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const docRef = doc(db, 'siteSettings', 'homepageContent');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        // Init default content
        const defaultContent = {
          heroHeadline: 'Premium Laundry Pickup & Delivery in Tauranga',
          heroSubheadline: 'We collect, clean, and deliver your garments perfectly folded. Reclaim your weekend.',
          heroCta: 'Book a Pickup',
          trustBadges: [
            { id: '1', text: 'Free Delivery', subtext: 'Tauranga Wide' },
            { id: '2', text: '48h Turnaround', subtext: 'Standard Service' },
            { id: '3', text: '5-Star Rated', subtext: 'Local Business' }
          ]
        };
        setContent(defaultContent);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load website content.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMsg('');
    try {
      await setDoc(doc(db, 'siteSettings', 'homepageContent'), content);
      setSuccessMsg('Website content updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to save content.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: any) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-xl sticky top-4 z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Website Content</h1>
          <p className="text-sm text-slate-500">Edit the text that appears on your public landing page.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0063CC] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Publish Changes
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium">{error}</div>}
      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium">{successMsg}</div>}

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <h2 className="text-xl font-bold mb-6">Hero Section</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Headline</label>
            <input 
              type="text" 
              value={content?.heroHeadline || ''} 
              onChange={e => updateField('heroHeadline', e.target.value)} 
              className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none text-xl font-bold" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sub-headline</label>
            <textarea 
              value={content?.heroSubheadline || ''} 
              onChange={e => updateField('heroSubheadline', e.target.value)} 
              className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none min-h-[100px]" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Call to Action Button</label>
            <input 
              type="text" 
              value={content?.heroCta || ''} 
              onChange={e => updateField('heroCta', e.target.value)} 
              className="w-full sm:w-64 bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none font-bold" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <h2 className="text-xl font-bold mb-6">Trust Badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(content?.trustBadges || []).map((badge: any, index: number) => (
             <div key={badge.id} className="bg-[#F5F5F7] p-4 rounded-xl">
                <input 
                  type="text" 
                  value={badge.text} 
                  onChange={e => {
                     const newBadges = [...content.trustBadges];
                     newBadges[index].text = e.target.value;
                     updateField('trustBadges', newBadges);
                  }} 
                  className="w-full bg-white border border-[#E5E5EA] rounded-lg p-2 mb-2 font-bold focus:ring-[#007AFF] outline-none" 
                />
                <input 
                  type="text" 
                  value={badge.subtext} 
                  onChange={e => {
                     const newBadges = [...content.trustBadges];
                     newBadges[index].subtext = e.target.value;
                     updateField('trustBadges', newBadges);
                  }} 
                  className="w-full bg-white border border-[#E5E5EA] rounded-lg p-2 text-sm focus:ring-[#007AFF] outline-none" 
                />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
