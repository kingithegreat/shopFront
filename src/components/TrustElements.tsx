import { CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export function TrustElements() {
  return (
    <div className="py-24 px-4 sm:px-8 space-y-24 max-w-7xl mx-auto">
      {/* Trust Badges Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-[#E5E5EA] pb-24">
         <div className="flex flex-col items-center">
            <ShieldCheck className="w-8 h-8 text-[#007AFF] mb-4" />
            <div className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest">100% Satisfaction</div>
         </div>
         <div className="flex flex-col items-center">
            <Lock className="w-8 h-8 text-[#007AFF] mb-4" />
            <div className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest">Secure Payments</div>
         </div>
         <div className="flex flex-col items-center">
            <CheckCircle2 className="w-8 h-8 text-[#007AFF] mb-4" />
            <div className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest">Fully Insured</div>
         </div>
         <div className="flex flex-col items-center">
            <svg className="w-8 h-8 text-[#007AFF] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="text-sm font-bold text-[#1D1D1F] uppercase tracking-widest">24h Turnaround</div>
         </div>
      </div>

      {/* Guarantees Section */}
      <section className="bg-white rounded-[2rem] p-12 sm:p-16 shadow-xl shadow-slate-200/40 border border-[#E5E5EA] flex flex-col md:flex-row gap-16 items-center">
        <div className="md:w-1/2 space-y-8">
          <div className="w-20 h-20 bg-blue-50 text-[#007AFF] rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-10 h-10" strokeWidth={2} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] tracking-tight">The FreshFold Promise</h2>
          <p className="text-xl text-[#6E6E73] leading-relaxed">
            We handle your garments with uncompromising care. If standard wash & fold doesn't leave your items fresh and perfectly folded, we'll re-do it at no charge. 
          </p>
          <ul className="space-y-5">
            {['Eco-friendly premium detergents', 'Strict temperature control', 'Professional folding techniques'].map((g, i) => (
              <li key={i} className="flex items-center space-x-4 text-[#1D1D1F] font-bold">
                <CheckCircle2 className="w-6 h-6 text-[#34C759] flex-shrink-0" />
                <span className="text-lg">{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:w-1/2 w-full grid grid-cols-2 gap-6">
          <div className="bg-[#F5F5F7] p-8 rounded-[2rem] text-center flex flex-col justify-center min-h-[240px] border border-[#E5E5EA] hover:-translate-y-2 transition-transform duration-500">
            <div className="text-7xl font-bold text-[#1D1D1F] mb-3 tracking-tighter">24<span className="text-3xl text-[#6E6E73] tracking-normal">h</span></div>
            <div className="text-xs font-bold text-[#6E6E73] uppercase tracking-widest">Turnaround</div>
          </div>
          <div className="bg-[#1D1D1F] text-white p-8 rounded-[2rem] text-center flex flex-col justify-center min-h-[240px] shadow-2xl relative overflow-hidden hover:-translate-y-2 transition-transform duration-500">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-3xl rounded-full -mr-16 -mt-16" />
             <div className="relative z-10 text-7xl font-bold mb-3 tracking-tighter">100<span className="text-3xl tracking-normal">%</span></div>
             <div className="relative z-10 text-xs font-bold text-slate-400 uppercase tracking-widest">Satisfaction</div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Placeholder */}
      <section className="max-w-4xl mx-auto pt-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#1D1D1F] mb-12 text-center tracking-tight">Common Questions</h2>
        <div className="space-y-6">
          {[
            { q: "How quickly will my laundry be returned?", a: "We guarantee a fast 24-hour turnaround time from the moment we pick up your laundry to perfectly folded delivery." },
            { q: "What areas do you service?", a: "We proudly serve the wider Tauranga area, including Mount Maunganui, Papamoa, Bethlehem, Pyes Pa, Tauriko, and surrounding suburbs within a 20km radius." },
            { q: "How does pickup work?", a: "Simply book online, place your laundry in bags, and leave them at your doorstep. We’ll notify you when our driver is en route and when your items are safely collected." },
            { q: "What if I have special washing requirements?", a: "You can easily add special instructions during the booking process. We use premium, eco-friendly detergents and provide special care for delicate or hypoallergenic needs." },
            { q: "How do payments work?", a: "We use a secure, encrypted payment gateway. You securely enter your card details online, and we process the payment only after your booking details are confirmed." }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-8 sm:p-10 rounded-[2rem] shadow-sm border border-[#E5E5EA] hover:-translate-y-1 transition-all duration-300">
               <div className="flex items-center justify-between cursor-pointer">
                  <div className="text-xl font-bold text-[#1D1D1F] mb-3">{faq.q}</div>
               </div>
               <div className="text-[#6E6E73] text-lg leading-relaxed">{faq.a}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
