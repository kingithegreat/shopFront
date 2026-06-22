import { Navigation, MapPin } from 'lucide-react';

export function ServiceAreaMap() {
  return (
    <div className="relative w-full h-full bg-[#E8EDF2] group overflow-hidden">
      {/* Premium Map visual abstraction */}
      <div className="absolute inset-0 bg-[#E8EDF2]" style={{ backgroundImage: 'radial-gradient(#CDE0F5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* Soft blue service radius overlay */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square rounded-full bg-blue-400/10 blur-[60px]" />
      
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 max-w-[400px] max-h-[400px] md:w-[120%] md:h-[120%] lg:w-[100%] lg:h-[100%] rounded-full border border-[#007AFF] bg-[#007AFF]/5 opacity-60 flex items-center justify-center">
      </div>

      {/* Center point - Tauranga Crossing */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500 z-20">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/10 relative">
          <Navigation className="w-6 h-6 text-[#007AFF] fill-[#007AFF]" />
          <div className="absolute -inset-2 rounded-full border-2 border-[#007AFF]/20 animate-[ping_3s_ease-in-out_infinite]" />
        </div>
        <div className="mt-2 bg-[#1D1D1F] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
          Tauranga Crossing Headquarters
        </div>
      </div>

      {/* Major Areas */}
      <div className="absolute top-[20%] left-[20%] flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#1D1D1F] rounded-full mb-1 border border-white box-content shadow-sm" />
        <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest whitespace-nowrap">Bethlehem</span>
      </div>
      <div className="absolute top-[15%] right-[25%] flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#1D1D1F] rounded-full mb-1 border border-white box-content shadow-sm" />
        <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest whitespace-nowrap">Mount Maunganui</span>
      </div>
      <div className="absolute top-[40%] right-[15%] flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#1D1D1F] rounded-full mb-1 border border-white box-content shadow-sm" />
        <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest whitespace-nowrap">Papamoa</span>
      </div>
      <div className="absolute bottom-[35%] right-[25%] flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#1D1D1F] rounded-full mb-1 border border-white box-content shadow-sm" />
        <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest whitespace-nowrap">Welcome Bay</span>
      </div>
      <div className="absolute bottom-[25%] left-[30%] flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#1D1D1F] rounded-full mb-1 border border-white box-content shadow-sm" />
        <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest whitespace-nowrap">Pyes Pa</span>
      </div>
      <div className="absolute bottom-[45%] left-[15%] flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 bg-[#1D1D1F] rounded-full mb-1 border border-white box-content shadow-sm" />
        <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-widest whitespace-nowrap">Tauriko</span>
      </div>

      {/* Free Pickup Badge */}
      <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md pl-2 pr-4 py-2 rounded-full shadow-lg border border-white flex items-center gap-3">
         <div className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
         </div>
         <div className="text-[11px] font-bold text-[#1D1D1F] uppercase tracking-widest whitespace-nowrap">Free Pickup & Delivery</div>
      </div>
    </div>
  );
}
