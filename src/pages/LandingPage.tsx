import { Link } from 'react-router-dom';
import { Shirt, Clock, Truck, ShieldCheck, CheckCircle2, Navigation, Package, Star, MapPin } from 'lucide-react';
import { PRICING } from '../lib/utils';
import { motion } from 'motion/react';
import { ServiceAreaMap } from '../components/ServiceAreaMap';
import { TrustElements } from '../components/TrustElements';
import { FloatingBookingWidget } from '../components/FloatingBookingWidget';

import { CommercialSection } from '../components/CommercialSection';
import { SubscriptionSection } from '../components/SubscriptionSection';
import { SocialProofSection } from '../components/SocialProofSection';
import { useConfig } from '../contexts/ConfigContext';
import { useServices } from '../hooks/useServices';

export function LandingPage() {
  const { homepageContent, homepageLayout, businessProfile, mediaAssets } = useConfig();
  const { services } = useServices();
  
  // Default values with fallback to config
  const headline = homepageContent?.heroHeadline || 'Laundry Done. Without Leaving Home.';
  const subheadline = homepageContent?.heroSubheadline || 'We collect, wash, fold and deliver your laundry anywhere within our local service area.';
  const cta = homepageContent?.heroCta || 'Book Pickup';
  const trustBadges = homepageContent?.trustBadges || [];

  const heroImage = mediaAssets?.heroImage || 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&q=80';
  const bizName = businessProfile?.businessName || 'FreshFold';

  const defaultSections = [
    { id: 'hero', visible: true },
    { id: 'trustStrip', visible: true },
    { id: 'howItWorks', visible: true, title: 'How It Works' },
    { id: 'pricing', visible: true, title: 'Pricing & Services' },
    { id: 'serviceArea', visible: true, title: 'Service Area Map' },
    { id: 'testimonials', visible: true, title: 'Testimonials' },
  ];

  const sections = homepageLayout?.sections?.length > 0 ? homepageLayout.sections : defaultSections;

  return (
    <div className="flex flex-col bg-[#F5F5F7] min-h-screen relative pb-32 md:pb-0">
      
      {sections.map((section: any) => {
        if (!section.visible) return null;

        switch (section.id) {
          case 'hero':
            return (
              <section key={section.id} className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                  {/* Left: Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:w-1/2 flex flex-col md:items-start text-center md:text-left z-10"
                  >
                    <div className="inline-flex items-center gap-2 bg-[#F2F2F7] px-4 py-2 rounded-full mb-8">
                      <span className="flex h-2 w-2 rounded-full bg-[#34C759]"></span>
                      <span className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">Now serving local areas</span>
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-[#1D1D1F] mb-6 leading-[1.05]" dangerouslySetInnerHTML={{ __html: headline.replace('.', '.<br/>') }} />
                    
                    <p className="text-xl text-[#6E6E73] mb-10 max-w-xl leading-relaxed">
                      {subheadline}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
                      <Link
                        to="/book"
                        className="w-full sm:w-auto bg-[#007AFF] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#0063CC] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98] text-center"
                      >
                        {cta}
                      </Link>
                      <a
                        href="#pricing"
                        className="w-full sm:w-auto bg-white text-[#1D1D1F] px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-colors border border-[#E5E5EA] shadow-sm active:scale-[0.98] text-center"
                      >
                        View Pricing
                      </a>
                    </div>
                  </motion.div>

                  {/* Right: Illustration */}
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                     className="lg:w-1/2 w-full relative perspective-[1000px]"
                  >
                     <div className="relative w-full aspect-square md:aspect-[4/3] bg-white rounded-[2rem] shadow-2xl border border-[#E5E5EA] overflow-hidden flex items-center justify-center -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img src={heroImage} alt="Hero" className="w-full h-full object-cover rounded-[1.5rem]" />
                     </div>
                  </motion.div>
                </div>
              </section>
            );

          case 'trustStrip':
            if (trustBadges.length === 0) return null;
            return (
              <section key={section.id} className="border-y border-[#E5E5EA] bg-white text-[#6E6E73] overflow-x-auto no-scrollbar">
                 <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex items-center justify-between gap-8 text-[11px] md:text-xs font-bold uppercase tracking-widest whitespace-nowrap min-w-max">
                    {trustBadges.map((badge: any) => (
                      <div key={badge.id} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                        <span className="text-[#1D1D1F]">{badge.text} - {badge.subtext}</span>
                      </div>
                    ))}
                 </div>
              </section>
            );

          case 'howItWorks':
            return (
              <section key={section.id} className="py-24 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] mb-6">{section.title}</h2>
                    <p className="text-xl text-[#6E6E73] max-w-2xl mx-auto">Simplifying your laundry day in three effortless steps.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {[
                      { icon: Truck, title: 'Schedule Pickup', desc: 'Book online in seconds. We collect your laundry directly from your doorstep at the time you choose.' },
                      { icon: Shirt, title: 'We Clean Your Laundry', desc: 'Our professionals wash, organically dry, and precisely fold your garments with premium eco-friendly care.' },
                      { icon: Clock, title: 'Delivered Fresh', desc: 'Your clothes are returned to you fresh, neatly packaged, and ready to be put away.' }
                    ].map((step, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
                        className="bg-white p-10 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-[#E5E5EA] flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500"
                      >
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 text-[#F5F5F7] opacity-50 group-hover:scale-110 transition-transform duration-700">
                          <step.icon className="w-48 h-48" strokeWidth={1} />
                        </div>
                        
                        <div className="text-[11px] font-bold text-[#007AFF] uppercase tracking-widest mb-6">Step {i + 1}</div>
                        <div className="w-20 h-20 bg-[#F5F5F7] text-[#1D1D1F] rounded-2xl flex items-center justify-center mb-8 z-10 group-hover:bg-[#007AFF] group-hover:text-white transition-colors duration-500">
                          <step.icon className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-[#1D1D1F] z-10">{step.title}</h3>
                        <p className="text-[#6E6E73] leading-relaxed text-lg z-10">{step.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'pricing':
            return (
              <section key={section.id} id="pricing" className="py-24 px-4 sm:px-8 bg-[#F5F5F7] border-b border-[#E5E5EA]">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] mb-6">{section.title}</h2>
                    <p className="text-xl text-[#6E6E73] max-w-2xl mx-auto">No hidden fees. Pickup and delivery are typically included.</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                      <div key={service.id} className={`rounded-[2rem] p-10 border shadow-xl flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 ${service.popular ? 'bg-[#1D1D1F] border-slate-800 text-white' : 'bg-white border-[#E5E5EA] text-[#1D1D1F]'}`}>
                         {service.popular && (
                           <>
                             <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-blue-500 opacity-20 blur-3xl rounded-full" />
                             <div className="absolute top-6 right-6">
                               <span className="bg-[#007AFF] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</span>
                             </div>
                           </>
                         )}
                         <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${service.popular ? 'bg-slate-800 text-white' : 'bg-[#F5F5F7] text-[#1D1D1F] group-hover:bg-[#007AFF] group-hover:text-white'}`}>
                            <Shirt className="w-8 h-8" />
                         </div>
                         <h3 className={`text-2xl font-bold mb-2 relative z-10 ${service.popular ? 'text-white' : 'text-[#1D1D1F]'}`}>{service.name}</h3>
                         <p className={`min-h-[48px] relative z-10 ${service.popular ? 'text-slate-400' : 'text-[#6E6E73]'}`}>{service.shortDescription || 'Standard laundry service.'}</p>
                         
                         <div className={`my-8 h-[1px] w-full relative z-10 ${service.popular ? 'bg-slate-800' : 'bg-[#E5E5EA]'}`} />
                         
                         <div className="flex items-baseline mb-8 relative z-10">
                            <span className={`text-5xl font-bold tracking-tighter ${service.popular ? 'text-white' : 'text-[#1D1D1F]'}`}>${service.basePrice}</span>
                            <span className={`font-bold uppercase tracking-widest text-xs ml-2 ${service.popular ? 'text-slate-400' : 'text-[#6E6E73]'}`}>/ bag</span>
                         </div>

                         <Link to="/book" className={`mt-auto w-full block text-center py-4 rounded-xl font-bold transition-all active:scale-[0.98] relative z-10 ${service.popular ? 'bg-[#007AFF] text-white hover:bg-[#0063CC] shadow-lg shadow-blue-500/20' : 'bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] hover:bg-[#1D1D1F] hover:text-white hover:border-[#1D1D1F]'}`}>
                            Book Now
                         </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case 'serviceArea':
            return (
              <section key={section.id} className="py-24 px-4 sm:px-8 border-b border-[#E5E5EA] bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 bg-[#F5F5F7] rounded-[2rem] border border-[#E5E5EA] shadow-sm p-12 sm:p-16">
                  <div className="md:w-1/2 w-full min-h-[450px] rounded-2xl overflow-hidden border border-[#E5E5EA]">
                     <ServiceAreaMap />
                  </div>
                  <div className="md:w-1/2">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] mb-6">{section.title}</h2>
                    <p className="text-xl text-[#6E6E73] mb-10 leading-relaxed">
                      We proudly operate locally. If you're near our center, pickup and delivery is usually free!
                    </p>
                    <ul className="space-y-4">
                      {[
                        {text: 'Free Pickup & Delivery in zone', icon: Truck},
                        {text: 'Locally Owned Business', icon: ShieldCheck},
                        {text: 'Fast 24h Turnaround', icon: Clock}
                      ].map((item, i) => (
                        <li key={i} className="flex items-center space-x-4 text-[#1D1D1F] font-bold bg-white border border-[#E5E5EA] p-4 rounded-xl shadow-sm">
                          <item.icon className="w-6 h-6 text-[#34C759] flex-shrink-0" />
                          <span className="text-lg">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );

          case 'testimonials':
            return (
              <section key={section.id} className="py-24 px-4 sm:px-8 bg-[#F5F5F7] border-b border-[#E5E5EA] overflow-hidden">
                 <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                       <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] mb-6">{section.title}</h2>
                       <p className="text-xl text-[#6E6E73] max-w-2xl mx-auto">Hundreds of locals trust {bizName} with their laundry each week.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                       {[
                          { name: "Sarah M.", area: "Local Customer", review: "Absolute game changer. I leave my bags on the porch and they come back perfectly folded the next day.", img: "SM" },
                          { name: "James T.", area: "Local Customer", review: "The service is incredibly reliable. I haven't done laundry in months and the app makes it so easy to book.", img: "JT" },
                          { name: "Emma H.", area: "Local Customer", review: "Best money I spend each week. The folding is impeccable, far better than what I could do myself.", img: "EH" }
                       ].map((review, i) => (
                          <div key={i} className="bg-white rounded-[2rem] p-10 border border-[#E5E5EA] shadow-lg shadow-slate-200/40 flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-500">
                             <div className="mb-8">
                                <div className="flex gap-1 mb-6">
                                   {[...Array(5)].map((_, star) => <svg key={star} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                </div>
                                <p className="text-lg text-[#1D1D1F] leading-relaxed italic">"{review.review}"</p>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#E8EDF2] flex items-center justify-center font-bold text-[#007AFF]">{review.img}</div>
                                <div>
                                   <div className="font-bold text-[#1D1D1F]">{review.name}</div>
                                   <div className="text-[11px] font-bold text-[#6E6E73] uppercase tracking-widest">{review.area}</div>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-8 mb-[80px] md:mb-12">
        <div className="max-w-5xl mx-auto rounded-[2.5rem] bg-[#1D1D1F] text-white text-center p-16 sm:p-24 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 blur-3xl rounded-full -mr-20 -mt-20" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-md border border-white/20">
               <ShieldCheck className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready for fresh laundry?</h2>
            <p className="text-xl text-slate-300 md:text-2xl mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              Join hundreds of residents saving hours every week. Book your first pickup today.
            </p>
            <Link
              to="/book"
              className="inline-block bg-[#007AFF] text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-white hover:text-[#007AFF] transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] border-2 border-transparent hover:border-white"
            >
              Book Pickup Now
            </Link>
          </div>
        </div>
      </section>
      
      <FloatingBookingWidget />
    </div>
  );
}
