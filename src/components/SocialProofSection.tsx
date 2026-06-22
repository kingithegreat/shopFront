import { Star, Truck, Users, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export function SocialProofSection() {
   return (
      <section className="bg-white border-y border-[#E5E5EA]">
         <div className="max-w-7xl mx-auto px-4 sm:px-8 py-24">
            <div className="text-center mb-16">
               <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] mb-6">Trusted Across Tauranga</h2>
               <p className="text-xl text-[#6E6E73] max-w-2xl mx-auto">We're the local team delivering fresh laundry and peace of mind to hundreds of families.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
               {[
                  { icon: Truck, stat: "15,000+", label: "Orders Completed" },
                  { icon: Star, stat: "4.9/5", label: "Average Rating" },
                  { icon: Users, stat: "92%", label: "Repeat Customers" },
                  { icon: MapPin, stat: "20km", label: "Service Radius" }
               ].map((item, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1, duration: 0.6 }}
                     className="bg-[#F5F5F7] p-8 rounded-[2rem] text-center flex flex-col items-center justify-center border border-[#E5E5EA] hover:-translate-y-2 transition-transform duration-300"
                  >
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <item.icon className="w-6 h-6 text-[#007AFF]" />
                     </div>
                     <div className="text-3xl md:text-5xl font-bold text-[#1D1D1F] mb-2 tracking-tight">{item.stat}</div>
                     <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">{item.label}</div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
}
