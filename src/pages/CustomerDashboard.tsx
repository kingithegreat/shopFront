import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { Booking, OrderStatus } from '../types';
import { Loader2, Package, MapPin, Calendar, CheckCircle2, Clock, ChevronRight, TrendingUp, RotateCw, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrackingTimeline } from '../components/TrackingTimeline';

const STATUS_DISPLAY: Record<OrderStatus, {label: string, color: string}> = {
  pending_payment: { label: 'Awaiting Payment', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  pickup_scheduled: { label: 'Pickup Scheduled', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  driver_assigned: { label: 'Driver Assigned', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  picked_up: { label: 'Laundry Collected', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  washing: { label: 'Cleaning In Progress', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  ready_for_delivery: { label: 'Ready for Delivery', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
};

export function CustomerDashboard() {
  const { currentUser, userData, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      if (!currentUser && !userData) {
        setLoading(false);
        return;
      }
      
      const userId = currentUser?.uid || 'guest';
      try {
        const q = query(
          collection(db, 'bookings'), 
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ ...doc.data() as Booking }));
        setBookings(docs);
      } catch (e) {
        console.error("Failed to load user bookings:", e);
      } finally {
        setLoading(false);
      }
    }
    
    if (!authLoading) {
      loadBookings();
    }
  }, [currentUser, userData, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center mb-12">
            <div className="space-y-4">
               <div className="w-64 h-10 bg-slate-200 rounded-lg animate-pulse" />
               <div className="w-96 h-6 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-40 h-14 bg-slate-200 rounded-full animate-pulse" />
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {[1,2,3,4].map(i => (
               <div key={i} className="bg-white p-6 rounded-[2rem] border border-[#E5E5EA] h-40 animate-pulse flex flex-col justify-between">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div className="space-y-2">
                     <div className="w-20 h-8 bg-slate-200 rounded-lg" />
                     <div className="w-24 h-4 bg-slate-200 rounded-lg" />
                  </div>
               </div>
            ))}
         </div>
         <div className="w-full h-64 bg-white rounded-[2rem] border border-[#E5E5EA] animate-pulse" />
      </div>
    );
  }

  const completedOrders = bookings.filter(b => b.status === 'delivered');
  const activeOrders = bookings.filter(b => b.status !== 'delivered' && b.status !== 'cancelled');
  const upcomingPickup = activeOrders[0];
  const lifetimeHoursSaved = completedOrders.length * 3; // Estimating 3 hours saved per order
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] tracking-tight">Welcome Back{userData?.name ? `, ${userData.name.split(' ')[0]}` : ''}</h1>
          <p className="text-lg text-[#6E6E73] mt-3">Manage your active pickups and view history.</p>
        </div>
        <Link to="/book" className="mt-6 sm:mt-0 bg-[#007AFF] text-white px-8 py-4 rounded-full font-bold hover:bg-[#0063CC] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center group">
          Book Pickup
          <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Summary Stats - Apple Wallet / Stripe Vibe */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
           <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#007AFF] mb-4">
              <Package className="w-5 h-5" />
           </div>
           <div>
              <div className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{activeOrders.length}</div>
              <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest mt-1">Active Orders</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
           <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#34C759] mb-4">
              <CheckCircle2 className="w-5 h-5" />
           </div>
           <div>
              <div className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{completedOrders.length}</div>
              <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest mt-1">Completed</div>
           </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
           <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-4">
              <Clock className="w-5 h-5" />
           </div>
           <div>
              <div className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{lifetimeHoursSaved} <span className="text-xl text-[#6E6E73]">hrs</span></div>
              <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest mt-1">Time Saved</div>
           </div>
        </div>
        <div className="bg-[#1D1D1F] text-white p-6 rounded-[2rem] shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-2xl rounded-full -mr-16 -mt-16" />
           <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-4 relative z-10">
              <RotateCw className="w-5 h-5 text-white" />
           </div>
           <div className="relative z-10">
              <div className="text-[11px] font-bold uppercase tracking-widest mb-1 opacity-70">Next Available</div>
              <div className="text-lg font-bold">Tomorrow Morning</div>
           </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 sm:p-20 text-center border border-[#E5E5EA] shadow-xl shadow-slate-200/50 flex flex-col items-center max-w-3xl mx-auto mt-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-5 blur-3xl rounded-full" />
          
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8 relative z-10 group-hover:scale-105 transition-transform duration-500">
             <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center flex-col border border-blue-100">
                <Package className="w-10 h-10 text-[#007AFF] mb-1" strokeWidth={1.5} />
             </div>
          </div>
          <h3 className="text-4xl font-bold text-[#1D1D1F] mb-4 tracking-tight relative z-10">No Orders Yet</h3>
          <h4 className="text-2xl font-bold text-[#1D1D1F] mb-4 tracking-tight relative z-10">Ready to skip laundry day?</h4>
          <p className="text-lg text-[#6E6E73] max-w-md mx-auto mb-10 leading-relaxed relative z-10">
             Book your first pickup and let FreshFold handle the rest. We'll pick up, clean, and deliver your laundry perfectly folded.
          </p>
          <Link to="/book" className="bg-[#007AFF] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#0063CC] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98] relative z-10 flex items-center gap-2">
            Schedule Your First Pickup
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Active Order Card */}
          {activeOrders.length > 0 && (
            <div>
               <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">Current Progress</h2>
               <div className="space-y-8">
                 {activeOrders.map(booking => {
                   const statusConfig = STATUS_DISPLAY[booking.status];
                   return (
                     <div key={booking.id} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E5E5EA] overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1 duration-500">
                       
                       {/* Top Info Banner */}
                       <div className="p-8 border-b border-[#E5E5EA] bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                         <div>
                           <div className="flex flex-wrap items-center gap-3 mb-3">
                             <span className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest bg-[#F5F5F7] px-3 py-1 rounded-full">Order FF-{booking.id.slice(-6)}</span>
                             <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusConfig.color}`}>
                               {statusConfig.label}
                             </span>
                           </div>
                           <div className="text-3xl font-bold text-[#1D1D1F] capitalize tracking-tight relative group inline-block">
                              {booking.serviceType.replace(/([A-Z])/g, ' $1').trim()}
                              <span className="text-[#6E6E73] font-medium ml-2 text-xl">• {booking.bagQuantity} Bags</span>
                           </div>
                         </div>
                         <div className="text-left md:text-right w-full md:w-auto bg-[#F5F5F7] md:bg-transparent p-4 md:p-0 rounded-2xl">
                           <div className="text-4xl font-bold text-[#007AFF] tracking-tighter">${booking.estimatedPrice}</div>
                           <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest mt-1 flex items-center md:justify-end gap-1">
                              {booking.paymentStatus === 'paid' ? <><CheckCircle2 className="w-3 h-3 text-[#34C759]"/> Paid Securely</> : 'Payment Pending'}
                           </div>
                         </div>
                       </div>

                       {/* Tracking Timeline */}
                       <div className="p-6 md:p-10 bg-white border-b border-[#E5E5EA]">
                          <TrackingTimeline status={booking.status} pickupDate={booking.pickupDate} />
                       </div>

                       {/* Detailed info area */}
                       <div className="p-8 grid md:grid-cols-2 gap-6 bg-[#F9FAFB] relative overflow-hidden">
                         <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#E5E5EA] to-transparent hidden md:block" />
                         
                         <div className="bg-white p-6 rounded-2xl border border-[#E5E5EA] shadow-sm">
                           <div className="flex items-start">
                             <div className="w-10 h-10 bg-blue-50 text-[#007AFF] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <Calendar className="w-5 h-5" />
                             </div>
                             <div>
                               <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">Scheduled Pickup</div>
                               <div className="text-base font-bold text-[#1D1D1F] mt-1">{new Date(booking.pickupDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric'})}</div>
                               <div className="text-sm text-[#6E6E73] mt-0.5">{booking.pickupTimeWindow}</div>
                             </div>
                           </div>
                         </div>
                         
                         <div className="bg-white p-6 rounded-2xl border border-[#E5E5EA] shadow-sm">
                           <div className="flex items-start">
                             <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <MapPin className="w-5 h-5" />
                             </div>
                             <div>
                               <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">Pickup Address</div>
                               <div className="text-base font-medium text-[#1D1D1F] mt-1 pr-4 line-clamp-2" title={booking.pickupAddress}>{booking.pickupAddress}</div>
                             </div>
                           </div>
                         </div>
                       </div>
                       
                       {booking.status === 'pending_payment' && (
                          <div className="p-6 bg-red-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 opacity-5 blur-3xl rounded-full" />
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                              <div className="flex items-center gap-3 text-red-800">
                                <Wallet className="w-6 h-6" />
                                <span className="font-medium">Please complete payment to secure your booking.</span>
                              </div>
                              <Link to={`/checkout/${booking.id}`} className="w-full sm:w-auto bg-[#007AFF] text-white text-center px-8 py-4 rounded-full font-bold hover:bg-[#0063CC] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                                Pay Securely Let's Go
                              </Link>
                            </div>
                          </div>
                       )}
                     </div>
                   );
                 })}
               </div>
            </div>
          )}

          {/* Past Orders List */}
          {completedOrders.length > 0 && (
             <div>
               <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6 flex items-center justify-between">
                 Order History
               </h2>
               <div className="bg-white rounded-[2rem] shadow-sm border border-[#E5E5EA] overflow-hidden hidden md:block">
                 <table className="w-full text-left bg-white">
                   <thead className="bg-[#F5F5F7] border-b border-[#E5E5EA]">
                     <tr>
                       <th className="px-8 py-5 text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">Order Ref</th>
                       <th className="px-8 py-5 text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">Date</th>
                       <th className="px-8 py-5 text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">Service</th>
                       <th className="px-8 py-5 text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">Status</th>
                       <th className="px-8 py-5 text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest text-right">Total</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-[#E5E5EA]">
                     {bookings.filter(b => b.status === 'delivered' || b.status === 'cancelled').map(booking => (
                       <tr key={booking.id} className="hover:bg-[#F5F5F7] transition-colors group">
                         <td className="px-8 py-6 font-bold text-[#1D1D1F]">FF-{booking.id.slice(-6)}</td>
                         <td className="px-8 py-6 text-sm text-[#6E6E73]">{new Date(booking.createdAt).toLocaleDateString()}</td>
                         <td className="px-8 py-6 text-sm text-[#1D1D1F] font-bold capitalize">{booking.serviceType.replace(/([A-Z])/g, ' $1').trim()}</td>
                         <td className="px-8 py-6">
                           <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${STATUS_DISPLAY[booking.status].color}`}>
                             {STATUS_DISPLAY[booking.status].label}
                           </span>
                         </td>
                         <td className="px-8 py-6 font-bold text-[#1D1D1F] text-right">${booking.estimatedPrice}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               
               {/* Mobile History View */}
               <div className="md:hidden space-y-4">
                 {bookings.filter(b => b.status === 'delivered' || b.status === 'cancelled').map(booking => (
                   <div key={booking.id} className="bg-white p-6 rounded-2xl border border-[#E5E5EA] shadow-sm flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#1D1D1F]">FF-{booking.id.slice(-6)}</span>
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${STATUS_DISPLAY[booking.status].color}`}>
                          {STATUS_DISPLAY[booking.status].label}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                           <div className="text-sm font-bold text-[#1D1D1F] capitalize">{booking.serviceType.replace(/([A-Z])/g, ' $1').trim()}</div>
                           <div className="text-xs text-[#6E6E73] mt-1">{new Date(booking.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="font-bold text-[#1D1D1F]">${booking.estimatedPrice}</div>
                      </div>
                   </div>
                 ))}
               </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
