import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save, Building2 } from 'lucide-react';

export function BusinessSettings() {
  const [data, setData] = useState({
    businessName: 'FreshFold Tauranga',
    phone: '',
    email: '',
    address: '',
    notificationEmail: '',
    gstNumber: '',
    paymentGateway: 'stripe',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: ''
    },
    openingHours: 'Mon - Fri: 8am - 6pm'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const docSnap = await getDoc(doc(db, 'siteSettings', 'businessProfile'));
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
      await setDoc(doc(db, 'siteSettings', 'businessProfile'), data);
      setSuccessMsg('Business settings saved successfully.');
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
           <h1 className="text-2xl font-bold tracking-tight">Business Settings</h1>
           <p className="text-sm text-slate-500">Contact details, compliance, and core info.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0063CC] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Profile
        </button>
      </div>

      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium">{successMsg}</div>}

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Building2 className="w-6 h-6 text-[#007AFF]" /> Core Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
              <input type="text" value={data.businessName} onChange={e => setData({...data, businessName: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none font-bold" />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">GST Details (Optional)</label>
              <input type="text" value={data.gstNumber} onChange={e => setData({...data, gstNumber: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="e.g. 12-345-678" />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label>
              <input type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Customer Support Email</label>
              <input type="email" value={data.email} onChange={e => setData({...data, email: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Admin Notification Email</label>
              <input type="email" value={data.notificationEmail} onChange={e => setData({...data, notificationEmail: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="Where should new order alerts go?" />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">General Opening Hours Text</label>
              <input type="text" value={data.openingHours} onChange={e => setData({...data, openingHours: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="e.g. Mon - Fri: 8am - 6pm" />
           </div>
           <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Headquarters Address</label>
              <input type="text" value={data.address} onChange={e => setData({...data, address: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
           </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <h2 className="text-xl font-bold mb-6">Integrations & Socials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Payment Gateway</label>
              <select value={data.paymentGateway} onChange={e => setData({...data, paymentGateway: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none">
                 <option value="stripe">Stripe</option>
                 <option value="paypal">PayPal</option>
                 <option value="bank_transfer">Manual Bank Transfer</option>
              </select>
           </div>
           <div />

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Facebook URL</label>
              <input type="url" value={data.socialLinks.facebook} onChange={e => setData({...data, socialLinks: {...data.socialLinks, facebook: e.target.value}})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="https://facebook.com/..." />
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Instagram URL</label>
              <input type="url" value={data.socialLinks.instagram} onChange={e => setData({...data, socialLinks: {...data.socialLinks, instagram: e.target.value}})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="https://instagram.com/..." />
           </div>
        </div>
      </div>

    </div>
  );
}
