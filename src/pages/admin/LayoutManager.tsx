import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save, GripVertical } from 'lucide-react';

export function LayoutManager() {
  const defaultSections = [
    { id: 'hero', name: 'Hero Area', visible: true, title: '' },
    { id: 'trustStrip', name: 'Trust Badges', visible: true, title: '' },
    { id: 'howItWorks', name: 'How It Works', visible: true, title: 'How It Works' },
    { id: 'pricing', name: 'Pricing & Services', visible: true, title: 'Simple Pricing' },
    { id: 'serviceArea', name: 'Service Area Map', visible: true, title: 'Where We Operate' },
    { id: 'testimonials', name: 'Testimonials', visible: true, title: 'What Locals Say' },
    { id: 'faq', name: 'FAQ', visible: true, title: 'Frequently Asked Questions' }
  ];

  const [sections, setSections] = useState<any[]>(defaultSections);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const docSnap = await getDoc(doc(db, 'siteSettings', 'homepageLayout'));
        if (docSnap.exists() && docSnap.data().sections) {
          setSections(docSnap.data().sections);
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
      await setDoc(doc(db, 'siteSettings', 'homepageLayout'), { sections });
      setSuccessMsg('Layout updated.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    setSections(newSections);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index + 1], newSections[index]] = [newSections[index], newSections[index + 1]];
    setSections(newSections);
  };

  const updateSection = (index: number, key: string, value: any) => {
     const newSections = [...sections];
     newSections[index][key] = value;
     setSections(newSections);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-xl sticky top-4 z-10">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Page Layout Structure</h1>
           <p className="text-sm text-slate-500">Reorder and toggle sections on the public homepage.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0063CC] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Layout
        </button>
      </div>

      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium">{successMsg}</div>}

      <div className="bg-white rounded-[2rem] border border-[#E5E5EA] overflow-hidden shadow-sm">
         <ul className="divide-y divide-[#E5E5EA]">
            {sections.map((section, index) => (
               <li key={section.id} className="p-6 flex items-center gap-6 hover:bg-[#F5F5F7] transition-colors">
                  <div className="flex flex-col gap-1 items-center">
                     <button onClick={() => moveUp(index)} disabled={index === 0} className="text-slate-400 hover:text-slate-800 disabled:opacity-30">▲</button>
                     <GripVertical className="w-5 h-5 text-slate-300" />
                     <button onClick={() => moveDown(index)} disabled={index === sections.length - 1} className="text-slate-400 hover:text-slate-800 disabled:opacity-30">▼</button>
                  </div>
                  
                  <div className="flex-1">
                     <h3 className="font-bold text-[#1D1D1F] text-lg mb-2">{section.name} (ID: {section.id})</h3>
                     <div className="flex items-center gap-4">
                        <div className="flex-1 max-w-sm">
                           <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Section Display Title</label>
                           <input 
                              type="text" 
                              value={section.title || ''} 
                              onChange={e => updateSection(index, 'title', e.target.value)}
                              disabled={section.id === 'hero' || section.id === 'trustStrip'}
                              placeholder={section.id === 'hero' || section.id === 'trustStrip' ? 'Not applicable for this section' : 'e.g. How It Works'}
                              className="w-full bg-white border border-[#E5E5EA] rounded-lg p-2 text-sm focus:border-[#007AFF] outline-none disabled:bg-slate-50 disabled:text-slate-400"
                           />
                        </div>
                        <label className="flex items-center gap-2 mt-4 ml-auto">
                           <input 
                              type="checkbox" 
                              checked={section.visible} 
                              onChange={e => updateSection(index, 'visible', e.target.checked)}
                              className="w-5 h-5 rounded border-slate-300 text-[#007AFF] focus:ring-[#007AFF]"
                           />
                           <span className="text-sm font-bold text-slate-700">Visible on Site</span>
                        </label>
                     </div>
                  </div>
               </li>
            ))}
         </ul>
      </div>
    </div>
  );
}
