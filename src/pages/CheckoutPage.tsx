import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Booking } from '../types';
import { Loader2, CreditCard, Lock, CheckCircle2, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { useConfig } from '../contexts/ConfigContext';

export function CheckoutPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { isConfigured } = useConfig();
  const [integrations, setIntegrations] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const [docSnap, integrationsSnap] = await Promise.all([
          getDoc(doc(db, 'bookings', id)),
          getDoc(doc(db, 'siteSettings', 'integrations'))
        ]);
        if (docSnap.exists()) {
          setBooking({ ...docSnap.data(), id: docSnap.id } as Booking);
        }
        if (integrationsSnap.exists()) {
          setIntegrations(integrationsSnap.data());
        }
      } catch (e) {
        console.error("Failed to load checkout data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSimulatePayment = async () => {
    if (!booking) return;
    setProcessing(true);
    
    try {
      // TODO: Integrate actual Stripe logic here.
      // 1. Create a PaymentIntent via a serverless function
      // 2. Confirm payment on the client using Stripe Elements
      
      // Simulating network delay for MVP demo
      await new Promise(r => setTimeout(r, 1500));
      
      const docRef = doc(db, 'bookings', booking.id);
      await updateDoc(docRef, {
        status: 'confirmed',
        paymentStatus: 'paid',
        updatedAt: Date.now()
      });
      
      setSuccess(true);
      
    } catch (e) {
      console.error(e);
      alert('Payment failed simulation');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px] animate-pulse p-8">
           <div className="h-4 w-64 bg-slate-200 rounded-full mb-16" />
           <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1 space-y-6">
                 <div className="h-10 bg-slate-100 rounded-xl w-3/4" />
                 <div className="h-24 bg-slate-100 rounded-xl w-full" />
                 <div className="h-24 bg-slate-100 rounded-xl w-full" />
              </div>
              <div className="md:w-[350px] space-y-4">
                 <div className="h-64 bg-slate-100 rounded-xl w-full" />
                 <div className="h-14 bg-slate-200 rounded-xl w-full" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-12 bg-white rounded-3xl border border-slate-100 shadow-xl text-center">
        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">Booking Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't locate this order.</p>
        <button onClick={() => navigate('/book')} className="text-[#007AFF] font-bold hover:underline">Start a new booking</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-12 mb-24 px-4 sm:px-6">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-8 sm:p-12 rounded-[2rem] border border-[#E5E5EA] shadow-xl shadow-slate-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 opacity-5 blur-3xl rounded-full -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#34C759]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-[#34C759]" strokeWidth={2.5} />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] text-center tracking-tight mb-2">Booking Confirmed</h2>
            <p className="text-[#6E6E73] text-center text-lg mb-8">Your payment was successful and your pickup is secured.</p>

            <div className="bg-[#F5F5F7] rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#E5E5EA]">
               <div className="text-center sm:text-left w-full sm:w-auto">
                  <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest mb-1">Pickup Scheduled For</div>
                  <div className="text-[#1D1D1F] font-bold text-lg">{new Date(booking.pickupDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}</div>
                  <div className="text-[#6E6E73]">{booking.pickupTimeWindow}</div>
               </div>
               <div className="w-full sm:w-[1px] h-[1px] sm:h-12 bg-[#E5E5EA]" />
               <div className="text-center sm:text-right w-full sm:w-auto">
                  <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest mb-1">Reference Number</div>
                  <div className="text-[#1D1D1F] font-mono font-bold tracking-widest text-lg">FF-{booking.id.slice(-6).toUpperCase()}</div>
               </div>
            </div>

            <div className="mb-10 text-left">
               <h3 className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest mb-4">What Happens Next</h3>
               <div className="space-y-4">
                  <div className="flex items-start gap-4">
                     <div className="w-8 h-8 rounded-full bg-blue-50 text-[#007AFF] flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                     <div>
                        <div className="font-bold text-[#1D1D1F]">We collect your laundry</div>
                        <div className="text-[#6E6E73] text-sm mt-0.5">Place your bags outside before your pickup window.</div>
                     </div>
                  </div>
                  <div className="ml-4 w-[1px] h-6 bg-[#E5E5EA]" />
                  <div className="flex items-start gap-4">
                     <div className="w-8 h-8 rounded-full bg-blue-50 text-[#007AFF] flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                     <div>
                        <div className="font-bold text-[#1D1D1F]">We clean and fold it</div>
                        <div className="text-[#6E6E73] text-sm mt-0.5">Our professionals process your garments with premium care.</div>
                     </div>
                  </div>
                  <div className="ml-4 w-[1px] h-6 bg-[#E5E5EA]" />
                  <div className="flex items-start gap-4">
                     <div className="w-8 h-8 rounded-full bg-blue-50 text-[#007AFF] flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                     <div>
                        <div className="font-bold text-[#1D1D1F]">We deliver it back fresh</div>
                        <div className="text-[#6E6E73] text-sm mt-0.5">Expect your fresh laundry delivered securely.</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-1/2 bg-[#007AFF] text-white py-4 rounded-full font-bold text-lg hover:bg-[#0063CC] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                Track Order
              </button>
              <button
                onClick={() => navigate('/book')}
                className="w-full sm:w-1/2 bg-white text-[#1D1D1F] border border-[#E5E5EA] py-4 rounded-full font-bold text-lg hover:bg-[#F5F5F7] transition-colors shadow-sm active:scale-[0.98]"
              >
                Book Another
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-5 gap-8">
        {/* Order Summary */}
        <div className="md:col-span-2 order-2 md:order-1">
          <div className="bg-[#F5F5F7] rounded-3xl p-8 border border-transparent">
            <h3 className="text-lg font-bold text-[#1D1D1F] mb-6">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Service</span>
                <span className="font-bold text-[#1D1D1F] capitalize">{booking.serviceType.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Quantity</span>
                <span className="font-bold text-[#1D1D1F]">{booking.bagQuantity} Bag(s)</span>
              </div>
              {booking.addOns.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Add-ons</span>
                  <span className="font-bold text-[#1D1D1F] capitalize">{booking.addOns.join(', ')}</span>
                </div>
              )}
              <div className="border-t border-slate-200/50 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-slate-500">Total</span>
                  <span className="text-2xl font-bold text-[#1D1D1F]">${booking.estimatedPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Mockup */}
        <div className="md:col-span-3 order-1 md:order-2">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xl">
            <div className="flex items-center space-x-3 mb-8 text-[#1D1D1F]">
              {integrations?.paymentMode === 'manual' ? <DollarSign className="w-8 h-8 text-[#007AFF]" /> : <CreditCard className="w-8 h-8 text-[#007AFF]" />}
              <h2 className="text-3xl font-bold">{integrations?.paymentMode === 'manual' ? 'Manual Payment' : 'Payment Setup'}</h2>
            </div>
            
            {integrations?.paymentMode === 'manual' ? (
              <p className="text-slate-500 mb-8 border-l-4 border-[#007AFF] bg-blue-50/50 p-4 rounded-xl text-sm leading-relaxed">
                <strong className="text-[#007AFF]">Cash on Delivery / Manual Payment:</strong> Please complete your booking to confirm the pickup. You will pay the provider upon delivery.
              </p>
            ) : (
              <p className="text-slate-500 mb-8 border-l-4 border-amber-400 bg-amber-50/50 p-4 rounded-xl text-sm leading-relaxed">
                <strong className="text-amber-700">MVP Placeholder:</strong> Real Stripe Elements integration would be loaded here. For now, you can simulate a successful test payment.
              </p>
            )}

            {integrations?.paymentMode !== 'manual' && (
              <div className="space-y-6 opacity-60 pointer-events-none select-none mb-10">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Card number</label>
                  <input type="text" value="•••• •••• •••• 4242" readOnly className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold text-[#1D1D1F] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Expiry</label>
                    <input type="text" value="12/26" readOnly className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold text-[#1D1D1F] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">CVC</label>
                    <input type="text" value="•••" readOnly className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold text-[#1D1D1F] outline-none" />
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={handleSimulatePayment}
              disabled={processing}
              className="w-full bg-[#007AFF] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:bg-[#0063CC] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              {processing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Processing test payment...</span></>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>{integrations?.paymentMode === 'manual' ? 'Confirm Booking' : `Pay $${booking.estimatedPrice} (Simulate)`}</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center">
              <Lock className="w-3 h-3 mr-1" /> Payments are secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
