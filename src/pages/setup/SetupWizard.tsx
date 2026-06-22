import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, setDoc, writeBatch } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import { Loader2, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export function SetupWizard() {
  const { userData } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Forms state
  const [businessProfile, setBusinessProfile] = useState({
    businessName: 'FreshFold',
    phone: '',
    email: '',
    address: '123 Tauranga Crossing, Tauriko, Tauranga 3110',
    openingHours: 'Mon - Fri: 8am - 6pm',
    setupComplete: false
  });

  const [bookingRules, setBookingRules] = useState({
    minNoticeHours: 24,
    maxAdvanceDays: 30,
    timeWindows: [
      { start: '08:00', end: '10:00', limit: 10, active: true },
      { start: '10:00', end: '12:00', limit: 10, active: true },
      { start: '13:00', end: '15:00', limit: 10, active: true },
      { start: '15:00', end: '17:00', limit: 8, active: true }
    ],
    closedDaysOfWeek: [] as number[],
    closedDates: [] as string[]
  });

  const [serviceArea, setServiceArea] = useState({
    radiusKm: 25,
    centreAddress: '123 Tauranga Crossing, Tauriko, Tauranga 3110',
    freeDeliveryRadiusKm: 15,
    outsideFeePerKm: 1.5,
    blockedSuburbs: ''
  });

  const [integrations, setIntegrations] = useState({
    paymentMode: 'stripe',
    stripePublishableKey: '',
    enableEmail: true,
    enableSms: false,
    googleAnalyticsId: ''
  });

  if (userData?.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = async () => {
    setSaving(true);
    setError('');
    try {
      const batch = writeBatch(db);
      
      // Save business profile
      batch.set(doc(db, 'siteSettings', 'businessProfile'), {
        ...businessProfile,
        setupComplete: true
      });
      
      batch.set(doc(db, 'siteSettings', 'bookingRules'), bookingRules);
      batch.set(doc(db, 'siteSettings', 'serviceArea'), serviceArea);
      batch.set(doc(db, 'siteSettings', 'integrations'), integrations);
      
      // Default website layout
      batch.set(doc(db, 'siteSettings', 'homepageLayout'), {
        sections: [
          { id: 'hero', name: 'Hero Area', visible: true, title: '' },
          { id: 'trustStrip', name: 'Trust Badges', visible: true, title: '' },
          { id: 'howItWorks', name: 'How It Works', visible: true, title: 'How It Works' },
          { id: 'pricing', name: 'Pricing & Services', visible: true, title: 'Simple Pricing' },
          { id: 'serviceArea', name: 'Service Area Map', visible: true, title: 'Where We Operate' },
          { id: 'testimonials', name: 'Testimonials', visible: true, title: 'What Locals Say' },
          { id: 'faq', name: 'FAQ', visible: true, title: 'Frequently Asked Questions' }
        ]
      });

      // Default website content
      batch.set(doc(db, 'siteSettings', 'homepageContent'), {
        heroHeadline: 'Premium Laundry Pickup & Delivery',
        heroSubheadline: 'We collect, clean, and deliver your garments perfectly folded. Reclaim your weekend.',
        heroCta: 'Book a Pickup',
        trustBadges: [
          { id: '1', text: 'Free Delivery', subtext: 'In Zone' },
          { id: '2', text: '48h Turnaround', subtext: 'Standard Service' },
          { id: '3', text: '5-Star Rated', subtext: 'Local Business' }
        ]
      });

      await batch.commit();

      // Seed default service
      const servicesRef = doc(db, 'services', 'wash-and-fold');
      await setDoc(servicesRef, {
        name: 'Wash & Fold',
        shortDescription: 'Everyday laundry, washed, dried and folded.',
        basePrice: 45,
        priceType: 'per_bag',
        popular: true,
        active: true,
        turnaroundHours: 48,
        sortOrder: 1
      });

      window.location.href = '/admin';
    } catch (err) {
      console.error(err);
      setError('Failed to save settings. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white max-w-3xl w-full rounded-[2rem] shadow-xl border border-[#E5E5EA] overflow-hidden flex flex-col">
        <div className="p-8 border-b border-[#E5E5EA]">
          <h1 className="text-2xl font-bold text-[#1D1D1F]">Platform Setup</h1>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-[#007AFF]' : 'bg-[#E5E5EA]'}`} />
            ))}
          </div>
        </div>
        
        <div className="p-8 flex-1 min-h-[400px]">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold mb-6">{error}</div>}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">1. Business Profile</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Business Name</label>
                <input type="text" value={businessProfile.businessName} onChange={e => setBusinessProfile({...businessProfile, businessName: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                  <input type="email" value={businessProfile.email} onChange={e => setBusinessProfile({...businessProfile, email: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
                  <input type="tel" value={businessProfile.phone} onChange={e => setBusinessProfile({...businessProfile, phone: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Headquarters Address</label>
                <input type="text" value={businessProfile.address} onChange={e => setBusinessProfile({...businessProfile, address: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">2. Service Area Rules</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Base Operations Address</label>
                <input type="text" value={serviceArea.centreAddress} onChange={e => setServiceArea({...serviceArea, centreAddress: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Maximum Radius (km)</label>
                  <input type="number" value={serviceArea.radiusKm} onChange={e => setServiceArea({...serviceArea, radiusKm: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Free Delivery Radius (km)</label>
                  <input type="number" value={serviceArea.freeDeliveryRadiusKm} onChange={e => setServiceArea({...serviceArea, freeDeliveryRadiusKm: parseFloat(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">3. Booking Settings</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Notice Period (hrs)</label>
                  <input type="number" value={bookingRules.minNoticeHours} onChange={e => setBookingRules({...bookingRules, minNoticeHours: parseInt(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Advance Booking Limit (days)</label>
                  <input type="number" value={bookingRules.maxAdvanceDays} onChange={e => setBookingRules({...bookingRules, maxAdvanceDays: parseInt(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">4. Integrations & Payments</h2>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm mb-4">
                You can configure full secret keys securely in your backend environment later. For now, setup the public integration settings.
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Payment Mode</label>
                <select value={integrations.paymentMode} onChange={e => setIntegrations({...integrations, paymentMode: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 font-bold">
                  <option value="stripe">Stripe Checkout (Online Payments)</option>
                  <option value="manual">Manual / Cash on Delivery</option>
                </select>
              </div>
              {integrations.paymentMode === 'stripe' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Stripe Publishable Key (Safe to store here)</label>
                  <input type="text" value={integrations.stripePublishableKey} onChange={e => setIntegrations({...integrations, stripePublishableKey: e.target.value})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 font-mono text-sm" placeholder="pk_test_..." />
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 text-center pt-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1D1D1F]">Ready to Launch!</h2>
              <p className="text-slate-500 max-w-sm mx-auto">
                Your platform is ready to go. You can add your full list of services and fine-tune your website from the Admin Panel.
              </p>
            </div>
          )}
        </div>
        
        <div className="p-8 bg-slate-50 border-t border-[#E5E5EA] flex justify-between items-center">
          <button 
            onClick={handleBack} 
            disabled={step === 1 || saving} 
            className="px-6 py-3 font-bold text-slate-500 hover:text-black flex items-center gap-2 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          {step < 5 ? (
             <button onClick={handleNext} className="bg-[#1D1D1F] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-colors">
               Next <ArrowRight className="w-5 h-5" />
             </button>
          ) : (
             <button onClick={handleComplete} disabled={saving} className="bg-[#007AFF] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#0063CC] transition-colors disabled:opacity-50">
               {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
               Complete Setup
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
