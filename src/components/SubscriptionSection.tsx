import { CalendarDays, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function SubscriptionSection() {
   return (
      <section className="bg-[#1D1D1F] text-white overflow-hidden relative">
         {/* Background glow effects */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

         <div className="max-w-7xl mx-auto px-4 sm:px-8 py-24 relative z-10">
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md border border-white/10">
                  <RefreshCw className="w-4 h-4 text-[#007AFF]" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-widest">Set and Forget</span>
               </div>
               <h2 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">Recurring Service</h2>
               <p className="text-xl text-slate-400 max-w-2xl mx-auto">Never worry about laundry day again. Set up a regular cadence and enjoy priority pickup times and loyalty pricing.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {[
                  { title: 'Weekly', desc: 'Perfect for busy families.', tag: 'Ultimate Convenience' },
                  { title: 'Fortnightly', desc: 'Ideal for couples and professionals.', tag: 'Most Popular', highlight: true },
                  { title: 'Monthly', desc: 'Great for bedding and seasonal items.', tag: 'Flexible' }
               ].map((plan, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1, duration: 0.6 }}
                     className={`rounded-[2.5rem] p-10 flex flex-col h-full border ${plan.highlight ? 'bg-[#007AFF] border-blue-400/50 shadow-2xl shadow-blue-900/50 scale-105 z-10' : 'bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors'}`}
                  >
                     <div className="mb-8">
                        <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-6 ${plan.highlight ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'}`}>
                           {plan.tag}
                        </div>
                        <h3 className="text-3xl font-bold mb-3">{plan.title} Pickup</h3>
                        <p className={plan.highlight ? 'text-blue-100' : 'text-slate-400'}>{plan.desc}</p>
                     </div>

                     <div className="my-8 h-[1px] w-full bg-white/10" />

                     <ul className="space-y-4 mb-10 flex-grow">
                        <li className="flex items-center gap-3">
                           <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-[#34C759]'}`} />
                           <span className="font-medium">Priority Scheduling</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-[#34C759]'}`} />
                           <span className="font-medium">Consistent Pickup Times</span>
                        </li>
                        <li className="flex items-center gap-3">
                           <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-white' : 'text-[#34C759]'}`} />
                           <span className="font-medium">Loyalty Pricing Rates</span>
                        </li>
                     </ul>

                     <Link to="/book" className={`w-full block text-center py-4 rounded-full font-bold text-lg active:scale-[0.98] transition-all ${plan.highlight ? 'bg-white text-[#007AFF] hover:bg-blue-50 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        Set Up Cadence
                     </Link>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
}
