import { CheckCircle2, Clock, Truck, Shirt, MapPin, Package, User } from 'lucide-react';
import type { OrderStatus } from '../types';

interface TrackingTimelineProps {
  status: OrderStatus;
  pickupDate?: string;
}

const TIMELINE_STEPS = [
  { status: 'pickup_scheduled', label: 'Pickup Scheduled', icon: Clock, desc: 'We have received your booking.' },
  { status: 'driver_assigned', label: 'Driver Assigned', icon: User, desc: 'A driver is heading to you.' },
  { status: 'picked_up', label: 'Laundry Collected', icon: MapPin, desc: 'Your laundry is secured.' },
  { status: 'washing', label: 'Cleaning In Progress', icon: Shirt, desc: 'Washing, drying & folding.' },
  { status: 'ready_for_delivery', label: 'Ready For Delivery', icon: Package, desc: 'Fresh and ready.' },
  { status: 'out_for_delivery', label: 'Out For Delivery', icon: Truck, desc: 'Heading your way.' },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Enjoy your fresh clothes!' },
];

export function TrackingTimeline({ status, pickupDate }: TrackingTimelineProps) {
  // Determine current step index
  let currentIndex = TIMELINE_STEPS.findIndex(s => s.status === status);
  
  // Handle edge cases
  if (status === 'pending_payment' || status === 'confirmed') currentIndex = 0;
  if (status === 'cancelled') return (
    <div className="bg-red-50 text-red-700 p-4 rounded-[1rem] text-center text-sm font-bold border border-red-200">
      This order has been cancelled.
    </div>
  );

  const progressPercentage = Math.max(0, (currentIndex / (TIMELINE_STEPS.length - 1)) * 100);

  return (
    <div className="relative py-4 px-2">
      {/* Progress Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#F5F5F7] p-6 rounded-[1.5rem] border border-[#E5E5EA]">
         <div>
            <div className="text-[#6E6E73] text-[11px] font-bold uppercase tracking-widest mb-1">Track Order</div>
            <div className="text-2xl font-bold text-[#1D1D1F]">{TIMELINE_STEPS[Math.max(0, currentIndex)]?.label || 'Processing'}</div>
         </div>
         <div className="text-right">
            <div className="text-[#6E6E73] text-[11px] font-bold uppercase tracking-widest mb-1">Estimated Turnaround</div>
            <div className="text-[#1D1D1F] font-medium">{pickupDate ? `24h from pickup` : 'Calculating...'}</div>
         </div>
      </div>

      <div className="relative w-full mb-8 h-2 bg-[#E5E5EA] rounded-full overflow-hidden hidden md:block">
         <div className="absolute top-0 left-0 h-full bg-[#007AFF] transition-all duration-1000 ease-out rounded-full" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="flex flex-col md:flex-row md:justify-between space-y-8 md:space-y-0 relative">
        {/* Horizontal Line for Desktop overlaying the dots */}
         <div className="hidden md:block absolute top-[28px] left-8 right-8 h-1 bg-[#E5E5EA] z-0" />
         
         <div className="hidden md:block absolute top-[28px] left-8 h-1 bg-[#007AFF] z-0 transition-all duration-1000 ease-out" 
              style={{ width: `${Math.max(0, (currentIndex / (TIMELINE_STEPS.length - 1)) * 100)}%`, maxWidth: 'calc(100% - 4rem)' }} />

        {TIMELINE_STEPS.map((step, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={idx} className={`flex md:flex-col items-center md:w-32 relative z-10 gap-4 md:gap-4 group ${isCurrent ? 'opacity-100 scale-105 transition-transform' : 'opacity-100'}`}>
              
              {/* Vertical line segment for Mobile */}
              {idx < TIMELINE_STEPS.length - 1 && (
                <div className="absolute left-[27px] top-[56px] w-[2px] h-[calc(100%+32px)] bg-[#E5E5EA] md:hidden -z-10" />
              )}
              {idx < currentIndex && (
                <div className="absolute left-[27px] top-[56px] w-[2px] h-[calc(100%+32px)] bg-[#007AFF] md:hidden -z-10" />
              )}

              <div className={`w-14 h-14 rounded-full flex gap-0 items-center justify-center border-4 border-white transition-all duration-700 shadow-sm relative z-10
                ${isCurrent ? 'bg-[#007AFF] text-white shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/10' : 
                  isPassed ? 'bg-[#1D1D1F] text-white' : 'bg-[#F5F5F7] text-[#6E6E73]'}`}
              >
                <Icon className={`w-6 h-6 ${isPassed ? 'opacity-100' : 'opacity-40'}`} strokeWidth={isCurrent ? 2.5 : 2} />
              </div>
              
              <div className="flex flex-col md:items-center items-start flex-1 md:flex-none">
                <span className={`text-sm font-bold md:min-h-[40px] flex items-center md:justify-center md:text-center
                  ${isCurrent ? 'text-[#007AFF]' : isPassed ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'}`}>
                  {step.label}
                </span>
                <span className={`text-xs md:text-center md:hidden lg:block hidden mt-1
                  ${isCurrent ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'}`}>
                  {step.desc}
                </span>
                {/* Mobile description */}
                <span className="text-xs text-[#6E6E73] md:hidden mt-0.5">{step.desc}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
