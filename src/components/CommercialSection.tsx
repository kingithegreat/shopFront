import { Building2, Home, Scissors, Dumbbell } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function CommercialSection() {
   return (
      <section className="bg-white py-24 px-4 sm:px-8 border-b border-[#E5E5EA]">
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
               <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-8">
                  <Building2 className="w-4 h-4 text-[#007AFF]" />
                  <span className="text-[11px] font-bold text-[#007AFF] uppercase tracking-widest">FreshFold For Business</span>
               </div>
               
               <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] tracking-tight mb-6">
                  Commercial Laundry Solutions.
               </h2>
               <p className="text-xl text-[#6E6E73] mb-10 leading-relaxed">
                  Reliable, consistent, and impeccably clean. We provide tailored laundry services for local businesses so you can focus on serving your clients.
               </p>
               
               <div className="grid grid-cols-2 gap-6 mb-10">
                  {[
                     { icon: Home, title: 'Airbnb & Rentals', desc: 'Flawless linens and guest towels.' },
                     { icon: Scissors, title: 'Salons & Spas', desc: 'Fresh, soft towels on rotation.' },
                     { icon: Building2, title: 'Small Offices', desc: 'Staff uniforms and office linens.' },
                     { icon: Dumbbell, title: 'Fitness Studios', desc: 'Hygienic towel processing.' }
                  ].map((item, i) => (
                     <div key={i} className="flex flex-col gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
                           <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="font-bold text-[#1D1D1F]">{item.title}</div>
                           <div className="text-sm text-[#6E6E73] mt-1">{item.desc}</div>
                        </div>
                     </div>
                  ))}
               </div>

               <Link to="/book" className="inline-block bg-[#1D1D1F] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-colors shadow-lg active:scale-[0.98]">
                  Request Business Quote
               </Link>
            </div>
            
            <div className="lg:w-1/2 w-full">
               <div className="bg-[#F5F5F7] rounded-[3rem] p-8 md:p-12 relative overflow-hidden h-[600px] flex items-center justify-center border border-[#E5E5EA]">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[80px] -translate-y-1/2" />
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[80px] translate-y-1/2" />
                  
                  <div className="relative z-10 grid grid-cols-2 gap-4 w-full h-full transform -rotate-12 scale-110">
                     <div className="space-y-4 pt-12">
                        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-xl border border-white shrink-0 aspect-[4/5] flex flex-col justify-end" />
                        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl border border-white shrink-0 aspect-[3/4] flex flex-col justify-end">
                           <div className="w-full h-1/2 bg-blue-50 rounded-2xl" />
                        </motion.div>
                     </div>
                     <div className="space-y-4">
                        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-3xl shadow-xl border border-white shrink-0 aspect-square flex flex-col justify-end">
                           <div className="w-full h-8 bg-[#F5F5F7] rounded-lg mb-2" />
                           <div className="w-2/3 h-8 bg-[#F5F5F7] rounded-lg" />
                        </motion.div>
                        <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-indigo-600 p-6 rounded-3xl shadow-xl border border-indigo-500 shrink-0 aspect-[4/5] flex flex-col justify-end text-white">
                           <Building2 className="w-12 h-12 text-indigo-400 mb-4" />
                           <div className="font-bold text-xl">Commercial</div>
                        </motion.div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
