import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Search, Star, MessageSquare } from 'lucide-react';
import { User } from '../../types';

export function CustomersManager() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'customer'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (uid: string, field: string, value: any) => {
    setUpdating(uid);
    try {
      await updateDoc(doc(db, 'users', uid), { [field]: value });
      setCustomers(prev => prev.map(c => c.uid === uid ? { ...c, [field]: value } : c));
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = customers.filter(c => 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
           <p className="text-slate-500 mt-2">Manage customer profiles and CRM notes.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full border border-slate-200 flex items-center shadow-sm w-full sm:w-64">
           <Search className="w-4 h-4 text-slate-400 mr-2" />
           <input 
             type="text" 
             placeholder="Search customers..." 
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
             className="w-full bg-transparent border-none outline-none text-sm font-medium focus:ring-0"
           />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-[#E5E5EA] overflow-hidden shadow-sm">
        {customers.length === 0 ? (
           <div className="p-12 text-center text-slate-500">No customers found.</div>
        ) : (
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-[#F5F5F7] border-b border-[#E5E5EA]">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">VIP Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Notes</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5EA]">
                 {filtered.map(c => (
                    <tr key={c.uid} className={`hover:bg-[#F5F5F7] transition-colors ${updating === c.uid ? 'opacity-50' : ''}`}>
                       <td className="px-6 py-4">
                          <div className="font-bold text-[#1D1D1F]">{c.displayName || 'No Name Provided'}</div>
                          <div className="text-xs text-slate-500">{c.email}</div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-500">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                       </td>
                       <td className="px-6 py-4">
                          <button 
                             onClick={() => handleUpdate(c.uid, 'isVip', !c.isVip)}
                             className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full transition-colors ${
                                c.isVip ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                             }`}
                          >
                             <Star className={`w-3 h-3 ${c.isVip ? 'fill-current' : ''}`} />
                             VIP
                          </button>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <input 
                                type="text"
                                defaultValue={c.internalNotes || ''}
                                placeholder="Add note..."
                                onBlur={(e) => {
                                  if (e.target.value !== c.internalNotes) {
                                     handleUpdate(c.uid, 'internalNotes', e.target.value);
                                  }
                                }}
                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-full max-w-[200px] outline-none focus:border-[#007AFF]"
                             />
                          </div>
                       </td>
                    </tr>
                 ))}
                 {filtered.length === 0 && searchTerm && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No customers match your search.</td></tr>
                 )}
              </tbody>
           </table>
        )}
      </div>
    </div>
  );
}
