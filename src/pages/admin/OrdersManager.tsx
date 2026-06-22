import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Booking, OrderStatus } from '../../types';
import { Loader2, Search, DollarSign, Package } from 'lucide-react';
import { PRICING } from '../../lib/utils';
import { Navigate } from 'react-router-dom';

const ALL_STATUSES: OrderStatus[] = [
  'pending_payment',
  'confirmed',
  'pickup_scheduled',
  'driver_assigned',
  'picked_up',
  'washing',
  'ready_for_delivery',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

export function OrdersManager() {
  const { userData, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    async function loadAllBookings() {
      try {
        const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setBookings(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Booking)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading && userData?.role === 'admin') {
      loadAllBookings();
    }
  }, [authLoading, userData]);

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-64 h-10 bg-slate-200 rounded-lg animate-pulse mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 flex items-center space-x-6 animate-pulse">
               <div className="w-16 h-16 bg-slate-200 rounded-full" />
               <div className="space-y-3">
                  <div className="w-24 h-4 bg-slate-200 rounded-lg" />
                  <div className="w-16 h-8 bg-slate-200 rounded-lg" />
               </div>
            </div>
          ))}
        </div>
        <div className="w-full h-96 bg-white rounded-3xl border border-slate-100 animate-pulse" />
      </div>
    );
  }

  if (userData?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleUpdateStatus = async (bookingId: string, newStatus: OrderStatus) => {
    setUpdating(bookingId);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus,
        updatedAt: Date.now()
      });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch(e) {
      console.error(e);
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdatePayment = async (bookingId: string, paymentStatus: 'pending' | 'paid' | 'failed') => {
    setUpdating(bookingId);
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        paymentStatus,
        updatedAt: Date.now()
      });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, paymentStatus } : b));
    } catch(e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  const filteredBookings = bookings.filter(b => {
    let statusMatch = filter === 'all' ? true : b.status === filter;
    let dateMatch = true;
    
    if (dateFilter.start || dateFilter.end) {
       // Filter by pickup date
       const bDate = new Date(b.pickupDate).getTime();
       if (dateFilter.start && bDate < new Date(dateFilter.start).getTime()) {
           dateMatch = false;
       }
       // set hours to end of day for end date
       if (dateFilter.end) {
           const endDate = new Date(dateFilter.end);
           endDate.setHours(23, 59, 59, 999);
           if (bDate > endDate.getTime()) {
               dateMatch = false;
           }
       }
    }
    
    return statusMatch && dateMatch;
  });
  
  const revenueTotal = filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((acc, curr) => acc + curr.estimatedPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1D1D1F] tracking-tight">Dispatch Panel</h1>
          <p className="text-lg text-slate-500 mt-2">Manage incoming orders and operations.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center space-x-6">
          <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center text-[#007AFF]">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Orders</div>
            <div className="text-4xl font-bold text-[#1D1D1F]">{bookings.filter(b => !['delivered', 'cancelled', 'pending_payment'].includes(b.status)).length}</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center space-x-6">
          <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center text-green-500">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</div>
            <div className="text-4xl font-bold text-[#1D1D1F]">${revenueTotal}</div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center space-x-6">
          <div className="w-16 h-16 bg-[#F5F5F7] rounded-full flex items-center justify-center text-purple-500">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Bookings</div>
            <div className="text-4xl font-bold text-[#1D1D1F]">{bookings.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 bg-[#F5F5F7] rounded-xl px-2">
              <Search className="w-5 h-5 text-slate-400 ml-2" />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-transparent border-0 text-[#1D1D1F] text-sm font-bold focus:ring-0 block p-3 outline-none"
              >
                <option value="all">All Orders</option>
                {ALL_STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
               <span className="text-xs font-bold text-slate-400 uppercase">From:</span>
               <input 
                  type="date" 
                  value={dateFilter.start} 
                  onChange={e => setDateFilter(prev => ({...prev, start: e.target.value}))}
                  className="bg-[#F5F5F7] border-0 text-[#1D1D1F] text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#007AFF] outline-none p-3"
               />
            </div>
            <div className="flex items-center space-x-2">
               <span className="text-xs font-bold text-slate-400 uppercase">To:</span>
               <input 
                  type="date" 
                  value={dateFilter.end} 
                  onChange={e => setDateFilter(prev => ({...prev, end: e.target.value}))}
                  className="bg-[#F5F5F7] border-0 text-[#1D1D1F] text-sm font-bold rounded-xl focus:ring-2 focus:ring-[#007AFF] outline-none p-3"
               />
            </div>
          </div>
          
          <div className="text-sm font-bold text-slate-400">
            Showing {filteredBookings.length} bookings
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-[#F5F5F7] border-b border-slate-100">
              <tr>
                <th scope="col" className="px-8 py-5">Order ID & Date</th>
                <th scope="col" className="px-8 py-5">Customer</th>
                <th scope="col" className="px-8 py-5">Service Details</th>
                <th scope="col" className="px-8 py-5">Payment</th>
                <th scope="col" className="px-8 py-5">Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className={`bg-white border-b border-slate-100 hover:bg-[#F5F5F7] transition-colors ${updating === booking.id ? 'opacity-50' : ''}`}>
                  <td className="px-8 py-6 font-bold text-[#1D1D1F] whitespace-nowrap">
                    <div>#{booking.id.slice(-6)}</div>
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{new Date(booking.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-[#1D1D1F]">{booking.customerName}</div>
                    <div className="text-xs text-slate-500 mt-1">{booking.phone}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[150px] mt-1" title={booking.pickupAddress}>{booking.pickupAddress}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="capitalize font-medium text-slate-700">{booking.serviceType.replace(/([A-Z])/g, ' $1').trim()} • {booking.bagQuantity}x</div>
                    {booking.addOns.length > 0 && <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">+{booking.addOns.join(', ')}</div>}
                    <div className="font-bold text-[#1D1D1F] mt-2">${booking.estimatedPrice}</div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={booking.paymentStatus}
                      onChange={(e) => handleUpdatePayment(booking.id, e.target.value as any)}
                      className={`text-[11px] uppercase tracking-widest rounded-full px-4 py-1.5 font-bold outline-none cursor-pointer border 
                        ${booking.paymentStatus === 'paid' ? 'border-green-300 text-green-700 bg-green-50' : 
                          booking.paymentStatus === 'failed' ? 'border-red-300 text-red-700 bg-red-50' : 
                          'border-amber-300 text-amber-700 bg-amber-50'}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={booking.status}
                      onChange={(e) => handleUpdateStatus(booking.id, e.target.value as any)}
                      className="bg-[#F5F5F7] border-0 text-[#1D1D1F] text-[11px] font-bold rounded-xl focus:ring-2 focus:ring-[#007AFF] block w-full p-3 outline-none uppercase tracking-widest cursor-pointer"
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                           <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">No orders found</h3>
                        <p className="text-sm text-slate-500">There are no orders matching your current filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
