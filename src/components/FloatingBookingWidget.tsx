import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock } from 'lucide-react';

export function FloatingBookingWidget() {
   return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:bottom-8 md:px-8 pointer-events-none flex justify-center">
         {/* Mobile Bottom Sheet & Desktop Floating Card */}
         <div className="w-full max-w-7xl relative">
            <div className="pointer-events-auto w-full md:w-auto bg-white/80 backdrop-blur-xl md:absolute md:right-0 md:bottom-0 p-4 md:p-6 rounded-[2rem] border border-white/40 shadow-2xl shadow-blue-900/10 flex flex-col md:flex-row items-center gap-4 md:gap-8 hover:-translate-y-1 transition-transform duration-300">
               
               <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#007AFF] flex items-center justify-center flex-shrink-0">
                     <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                     <div className="text-[10px] font-bold text-[#6E6E73] uppercase tracking-widest mb-0.5">Next Available Pickup</div>
                     <div className="text-[#1D1D1F] font-bold text-lg md:text-xl">Tomorrow Morning</div>
                  </div>
               </div>

               <div className="hidden md:block w-[1px] h-12 bg-[#E5E5EA]" />

               <div className="flex w-full md:w-auto gap-4">
                  <Link to="/book" className="flex-1 md:flex-none uppercase tracking-widest bg-[#007AFF] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#0063CC] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center group whitespace-nowrap">
                     Book Pickup Now
                     <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>

            </div>
         </div>
      </div>
   );
}
