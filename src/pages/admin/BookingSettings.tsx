import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save, Calendar as CalendarIcon, Clock } from 'lucide-react';

export function BookingSettings() {
  const [data, setData] = useState({
    minNoticeHours: 24,
    maxAdvanceDays: 30,
    timeWindows: [
      { start: '08:00', end: '10:00', limit: 10, active: true },
      { start: '10:00', end: '12:00', limit: 10, active: true },
      { start: '13:00', end: '15:00', limit: 10, active: true },
      { start: '15:00', end: '17:00', limit: 8, active: true }
    ],
    closedDaysOfWeek: [] as number[], // 0 = Sunday, 1 = Monday
    closedDates: [] as string[] // YYYY-MM-DD
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const docSnap = await getDoc(doc(db, 'siteSettings', 'bookingRules'));
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
      await setDoc(doc(db, 'siteSettings', 'bookingRules'), data);
      setSuccessMsg('Booking rules saved.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleDayOfWeek = (day: number) => {
    setData(prev => ({
      ...prev,
      closedDaysOfWeek: prev.closedDaysOfWeek.includes(day) 
         ? prev.closedDaysOfWeek.filter(d => d !== day)
         : [...prev.closedDaysOfWeek, day]
    }));
  };

  const addClosedDate = () => {
    if (newDate && !data.closedDates.includes(newDate)) {
      setData(prev => ({ ...prev, closedDates: [...prev.closedDates, newDate] }));
    }
    setNewDate('');
  };

  const removeClosedDate = (date: string) => {
    setData(prev => ({ ...prev, closedDates: prev.closedDates.filter(d => d !== date) }));
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-[#E5E5EA] shadow-xl sticky top-4 z-10">
        <div>
           <h1 className="text-2xl font-bold tracking-tight">Booking Rules</h1>
           <p className="text-sm text-slate-500">Configure availability, notice periods, and capacity.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#007AFF] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0063CC] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {successMsg && <div className="bg-green-50 text-green-700 p-4 rounded-xl font-medium">{successMsg}</div>}

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock className="w-6 h-6 text-[#007AFF]" /> Time Windows & Limits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Notice Period (Hours)</label>
              <input type="number" value={data.minNoticeHours} onChange={e => setData({...data, minNoticeHours: parseInt(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
              <p className="text-xs text-slate-500 mt-2">Hours before a pickup window can be booked.</p>
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Maximum Advance Booking (Days)</label>
              <input type="number" value={data.maxAdvanceDays} onChange={e => setData({...data, maxAdvanceDays: parseInt(e.target.value)})} className="w-full bg-[#F5F5F7] border-0 rounded-xl p-4 focus:ring-2 focus:ring-[#007AFF] outline-none" />
           </div>
        </div>

        <div className="space-y-4">
           {data.timeWindows.map((tw, i) => (
             <div key={i} className={`flex flex-wrap items-center gap-4 bg-[#F5F5F7] p-4 rounded-xl ${!tw.active && 'opacity-50'}`}>
                <input type="time" value={tw.start} onChange={e => {
                  const newTW = [...data.timeWindows];
                  newTW[i].start = e.target.value;
                  setData({...data, timeWindows: newTW});
                }} className="bg-white border-0 rounded-lg p-2 font-bold" />
                <span className="text-slate-400 font-bold">to</span>
                <input type="time" value={tw.end} onChange={e => {
                  const newTW = [...data.timeWindows];
                  newTW[i].end = e.target.value;
                  setData({...data, timeWindows: newTW});
                }} className="bg-white border-0 rounded-lg p-2 font-bold" />
                
                <div className="flex items-center gap-2 ml-auto">
                   <label className="text-sm font-bold text-slate-600">Max Bookings:</label>
                   <input type="number" value={tw.limit} onChange={e => {
                     const newTW = [...data.timeWindows];
                     newTW[i].limit = parseInt(e.target.value);
                     setData({...data, timeWindows: newTW});
                   }} className="w-20 bg-white border-0 rounded-lg p-2 font-bold" />
                </div>

                <label className="flex items-center gap-2">
                   <input type="checkbox" checked={tw.active} onChange={e => {
                     const newTW = [...data.timeWindows];
                     newTW[i].active = e.target.checked;
                     setData({...data, timeWindows: newTW});
                   }} />
                   <span className="text-sm font-bold text-slate-600">Active</span>
                </label>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-[#E5E5EA] shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CalendarIcon className="w-6 h-6 text-[#007AFF]" /> Schedule & Holidays</h2>
        
        <div className="mb-8">
           <label className="block text-sm font-bold text-slate-700 mb-4">Closed Days of the Week</label>
           <div className="flex flex-wrap gap-3">
              {days.map((day, i) => (
                 <button 
                   key={day}
                   onClick={() => toggleDayOfWeek(i)}
                   className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                     data.closedDaysOfWeek.includes(i) 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-[#F5F5F7] text-slate-600 hover:bg-slate-200'
                   }`}
                 >
                   {day}
                 </button>
              ))}
           </div>
           <p className="text-xs text-slate-500 mt-2">Highlighted days are disabled on the booking calendar.</p>
        </div>

        <div>
           <label className="block text-sm font-bold text-slate-700 mb-4">Specific Closed Dates (Holidays)</label>
           <div className="flex items-center gap-4 mb-4">
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="bg-[#F5F5F7] border-0 rounded-xl p-3 focus:ring-2 focus:ring-[#007AFF] outline-none" />
              <button 
                onClick={addClosedDate}
                className="bg-[#1D1D1F] text-white px-4 py-3 rounded-xl font-bold hover:bg-black transition-colors text-sm"
              >
                Add Date
              </button>
           </div>
           <div className="flex flex-wrap gap-2">
              {data.closedDates.sort().map(date => (
                 <div key={date} className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                    {date}
                    <button onClick={() => removeClosedDate(date)} className="text-red-400 hover:text-red-700">&times;</button>
                 </div>
              ))}
              {data.closedDates.length === 0 && <span className="text-sm text-slate-400">No specific closed dates added.</span>}
           </div>
        </div>
      </div>
    </div>
  );
}
