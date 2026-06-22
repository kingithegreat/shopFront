import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save, CreditCard, Mail, MessageSquare, Map, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export function IntegrationsManager() {
  const { userData } = useAuth();
  const [data, setData] = useState({
    paymentMode: 'stripe',
    stripePublishableKey: '',
    enableEmail: false,
    enableSms: false,
    googleAnalyticsId: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('payments');

  useEffect(() => {
    async function loadData() {
      try {
        const docSnap = await getDoc(doc(db, 'siteSettings', 'integrations'));
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

  if (userData?.role !== 'owner') {
    return <Navigate to="/admin" replace />;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'siteSettings', 'integrations'), data);
      setSuccessMsg('Integrations updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;

  const tabs = [
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'email', icon: Mail, label: 'Email' },
    { id: 'sms', icon: MessageSquare, label: 'SMS' },
    { id: 'maps', icon: Map, label: 'Maps' },
    { id: 'analytics', icon: Activity, label: 'Analytics' }
  ];

  return (
    <div className="space-y-8 max-w-5xl">
       <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-xl sticky top-4 z-10">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Integrations</h1>
           <p className="text-sm text-slate-500">Manage connections to third-party services.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0063CC] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Integrations
        </button>
      </div>

      <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl text-sm font-medium">
         <strong>Security Notice:</strong> Only store Public API Keys here. Secret API Keys (e.g. Stripe Secret Key, Twilio Auth Token) must be stored securely in your backend environment variables or Firestore secret manager.
      </div>

      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium">{successMsg}</div>}

      <div className="flex gap-8">
        <div className="w-64 shrink-0">
           <div className="bg-white rounded-2xl border border-[#E5E5EA] p-4 flex flex-col gap-2">
             {tabs.map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === tab.id ? 'bg-[#007AFF] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                   <tab.icon className="w-5 h-5" />
                   {tab.label}
                </button>
             ))}
           </div>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] border border-[#E5E5EA] shadow-sm p-8 min-h-[500px]">
           {activeTab === 'payments' && (
             <div className="space-y-6">
               <h2 className="text-xl font-bold mb-6">Payment Configuration</h2>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Payment Mode</label>
                  <select value={data.paymentMode} onChange={e => setData({...data, paymentMode: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 outline-none font-bold">
                     <option value="stripe">Stripe Checkout (Online Payments)</option>
                     <option value="manual">Manual / Cash on Delivery</option>
                  </select>
               </div>
               
               {data.paymentMode === 'stripe' && (
                 <div className="space-y-4 pt-4 border-t border-[#E5E5EA]">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Stripe Publishable Key</label>
                      <input type="text" value={data.stripePublishableKey} onChange={e => setData({...data, stripePublishableKey: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 font-mono text-sm" placeholder="pk_test_..." />
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                       <h4 className="font-bold text-sm text-slate-700 mb-2">Required Backend Setup</h4>
                       <p className="text-xs text-slate-500 mb-2">To complete Stripe integration, you must add the following environment variables to your Cloud Functions or Node.js server:</p>
                       <ul className="list-disc pl-5 text-xs text-slate-600 font-mono">
                         <li>STRIPE_SECRET_KEY</li>
                         <li>STRIPE_WEBHOOK_SECRET</li>
                       </ul>
                    </div>
                 </div>
               )}
             </div>
           )}

           {activeTab === 'email' && (
             <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">Email Notifications</h2>
                <label className="flex items-center gap-3">
                   <input type="checkbox" checked={data.enableEmail} onChange={e => setData({...data, enableEmail: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-[#007AFF] focus:ring-[#007AFF]" />
                   <span className="font-bold text-slate-700">Enable Email Notifications</span>
                </label>
                
                {data.enableEmail && (
                   <div className="space-y-4 pt-4 border-t border-[#E5E5EA]">
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                       <h4 className="font-bold text-sm text-slate-700 mb-2">Email Provider Setup</h4>
                       <p className="text-xs text-slate-500 mb-2">Emails are sent via the Firebase Email Trigger extension or your custom backend endpoints. We recommend <strong>SendGrid</strong> or <strong>Resend</strong>.</p>
                     </div>
                   </div>
                )}
             </div>
           )}

           {activeTab === 'sms' && (
             <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">SMS Notifications</h2>
                <label className="flex items-center gap-3">
                   <input type="checkbox" checked={data.enableSms} onChange={e => setData({...data, enableSms: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-[#007AFF] focus:ring-[#007AFF]" />
                   <span className="font-bold text-slate-700">Enable SMS Notifications</span>
                </label>

                {data.enableSms && (
                   <div className="space-y-4 pt-4 border-t border-[#E5E5EA]">
                     <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                       <h4 className="font-bold text-sm text-slate-700 mb-2">SMS Provider Setup</h4>
                       <p className="text-xs text-slate-500 mb-2">Configure Twilio credentials in your securely managed backend to enable SMS order updates.</p>
                     </div>
                   </div>
                )}
             </div>
           )}

           {activeTab === 'maps' && (
             <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">Maps & Geocoding</h2>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                   <h4 className="font-bold text-sm text-slate-700 mb-2">Distance Calculation</h4>
                   <p className="text-xs text-slate-500 mb-4">Currently, distance checks use an approximated geometric bounds check based on New Zealand postal codes for standard MVP operation.</p>
                   <p className="text-xs text-slate-500">To enable precise route calculation, add Google Maps API Keys to your environment variables.</p>
                </div>
             </div>
           )}

           {activeTab === 'analytics' && (
             <div className="space-y-6">
                <h2 className="text-xl font-bold mb-6">Analytics & Tracking</h2>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Google Analytics Measurement ID</label>
                  <input type="text" value={data.googleAnalyticsId} onChange={e => setData({...data, googleAnalyticsId: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" placeholder="G-XXXXXXXXXX" />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
