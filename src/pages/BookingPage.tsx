import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import { MapPin, Info, ArrowRight, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { PRICING, mockGeocodeAddress, getDistanceFromLatLonInKm, CENTRAL_LAT, CENTRAL_LNG, MAX_RADIUS_KM } from '../lib/utils';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Booking } from '../types';
import { usePricing } from '../hooks/usePricing';
import { useServices } from '../hooks/useServices';
import { useAddons } from '../hooks/useAddons';
import { getEstimatedReturnDate } from '../lib/pricing';

export function BookingPage() {
  const navigate = useNavigate();
  const { currentUser, userData, loading: authLoading } = useAuth();
  const { serviceArea, bookingRules, isConfigured } = useConfig();
  
  const [step, setStep] = useState(1);
  const [verifyingAddress, setVerifyingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Hooks
  const { services, loading: servicesLoading } = useServices();
  const { addons: availableAddons, loading: addonsLoading } = useAddons();

  // Pricing hook
  const { serviceId, setServiceId, bagQuantity, setBagQuantity, selectedAddOnIds, toggleAddOn, breakdown, selectedService } = usePricing(services, availableAddons);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupAddress: '',
    deliveryAddress: '',
    sameAsPickup: true,
    date: '',
    timeWindow: bookingRules?.timeWindows?.[0] || '09:00 - 11:00',
    instructions: ''
  });

  const [pickupCoords, setPickupCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (userData && !formData.name) {
      setFormData(prev => ({
        ...prev,
        email: userData.email,
        name: userData.role === 'customer' ? (prev.name || '') : prev.name
      }));
    }
  }, [userData]);

  useEffect(() => {
    if (bookingRules?.timeWindows?.length && formData.timeWindow === '09:00 - 11:00' && !bookingRules.timeWindows.includes('09:00 - 11:00')) {
      setFormData(prev => ({ ...prev, timeWindow: bookingRules.timeWindows[0] }));
    }
  }, [bookingRules, formData.timeWindow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVerifyAddress = async () => {
    if (!formData.pickupAddress.trim()) {
      setAddressError('Please enter a pickup address');
      return;
    }

    setVerifyingAddress(true);
    setAddressError('');
    
    try {
      const coords = await mockGeocodeAddress(formData.pickupAddress);
      
      if (!coords) {
        setAddressError('Could not find this address. Please check and try again.');
        return;
      }

      const centerLat = serviceArea?.centerLat || CENTRAL_LAT;
      const centerLng = serviceArea?.centerLng || CENTRAL_LNG;
      const radiusKm = serviceArea?.radiusKm || MAX_RADIUS_KM;

      const distance = getDistanceFromLatLonInKm(centerLat, centerLng, coords.lat, coords.lng);
      
      if (serviceArea?.enforceServiceArea !== false && distance > radiusKm) {
        setAddressError(`Sorry, this address is outside our ${radiusKm}km service area.`);
        setPickupCoords(null);
      } else {
        setPickupCoords(coords);
        setStep(3); // Proceed to Schedule
      }
    } catch (err) {
      setAddressError('An error occurred verifying your address. Please try again.');
    } finally {
      setVerifyingAddress(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pickupCoords) return;
    
    setIsSubmitting(true);
    try {
      const userId = currentUser?.uid || 'guest';
      const newBookingRef = doc(collection(db, 'bookings'));

      const bookingParams: Booking = {
        id: newBookingRef.id,
        userId,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.sameAsPickup ? formData.pickupAddress : formData.deliveryAddress,
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        pickupDate: formData.date,
        pickupTimeWindow: formData.timeWindow,
        serviceType: selectedService?.name || serviceId,
        bagQuantity: Number(bagQuantity),
        addOns: selectedAddOnIds,
        specialInstructions: formData.instructions,
        estimatedPrice: breakdown.total,
        status: 'pending_payment',
        paymentStatus: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await setDoc(newBookingRef, bookingParams);
      navigate(`/checkout/${newBookingRef.id}`);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to submit booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getMinDateString = () => {
    // Determine the minimum advance notice required
    const minimumNoticeHours = bookingRules?.minimumNoticeHours || 24;
    const advanceDays = Math.ceil(minimumNoticeHours / 24);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + advanceDays);
    return minDate.toISOString().split('T')[0];
  };

  if (authLoading || servicesLoading || addonsLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden min-h-[600px] animate-pulse">
           <div className="bg-slate-100 h-32 w-full" />
           <div className="p-8">
              <div className="h-4 w-64 bg-slate-200 rounded-full mx-auto mb-16" />
              <div className="space-y-6 max-w-2xl mx-auto">
                 <div className="h-6 w-48 bg-slate-200 rounded-full mb-8" />
                 <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-slate-100 rounded-xl" />
                    <div className="h-24 bg-slate-100 rounded-xl" />
                    <div className="h-24 bg-slate-100 rounded-xl" />
                 </div>
                 <div className="h-10 bg-slate-100 rounded-xl mt-8" />
              </div>
           </div>
        </div>
      </div>
    );
  }

  const STEPS = [
    { id: 1, title: 'Service' },
    { id: 2, title: 'Address' },
    { id: 3, title: 'Schedule' },
    { id: 4, title: 'Review' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-[#F5F5F7] border-b border-slate-100 px-8 py-8 md:py-10 text-center">
          <h1 className="text-3xl font-bold text-[#1D1D1F]">Schedule a Pickup</h1>
          <p className="text-slate-500 mt-2">Book your premium laundry service effortlessly.</p>
        </div>

        <div className="p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto relative">
             <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full" />
             <div className="absolute top-1/2 left-0 h-1 bg-[#007AFF] -z-10 -translate-y-1/2 transition-all duration-500 rounded-full" style={{ width: `${((step - 1) / 3) * 100}%` }} />
             
             {STEPS.map((s) => (
               <div key={s.id} className="flex flex-col items-center gap-2">
                 <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${step >= s.id ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30' : 'bg-[#F5F5F7] text-slate-400 border-2 border-white'}`}>
                   {step > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                 </div>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-[#007AFF]' : 'text-slate-400'} hidden sm:block`}>{s.title}</span>
               </div>
             ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="max-w-2xl mx-auto">
            
            {/* STEP 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">What can we wash for you?</h2>
                
                <div className="space-y-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Service Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {services.map(option => (
                      <label key={option.id} className={`cursor-pointer transition-all ${serviceId === option.id ? 'border-2 border-[#007AFF] bg-blue-50/50 p-4 rounded-2xl text-left' : 'border-2 border-transparent bg-[#F5F5F7] p-4 rounded-2xl text-left hover:border-slate-300'}`}>
                        <input type="radio" name="serviceId" value={option.id} checked={serviceId === option.id} onChange={(e) => setServiceId(e.target.value)} className="sr-only" />
                        <div className="text-sm font-bold text-[#1D1D1F] mb-1">{option.name}</div>
                        <div className="text-[11px] font-bold text-slate-500">${option.basePrice} / bag</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Number of Bags</label>
                    <select value={bagQuantity} onChange={(e) => setBagQuantity(Number(e.target.value))} className="w-full bg-[#F5F5F7] border-0 rounded-2xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none cursor-pointer">
                      {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Bag{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Add-ons</label>
                    {availableAddons.map(addon => (
                      <label key={addon.id} className={`flex items-center space-x-3 p-4 mb-2 rounded-2xl cursor-pointer transition-colors ${selectedAddOnIds.includes(addon.id) ? 'bg-blue-50/50 border-2 border-[#007AFF]' : 'bg-[#F5F5F7] border-2 border-transparent hover:border-slate-300'}`}>
                        <input type="checkbox" checked={selectedAddOnIds.includes(addon.id)} onChange={() => toggleAddOn(addon.id)} className="h-5 w-5 rounded border-slate-300 text-[#007AFF] focus:ring-[#007AFF]" />
                        <div className="flex-1">
                          <div className="text-sm font-bold text-[#1D1D1F]">{addon.name}</div>
                          <div className="text-[11px] font-bold text-slate-500">+${addon.price} total</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1D1D1F] p-6 rounded-2xl text-white flex items-center justify-between mt-8">
                  <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">Subtotal Estimate</div>
                  <div className="text-3xl font-bold">${breakdown.total}</div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="button" onClick={() => setStep(2)} className="flex items-center justify-center space-x-2 bg-[#007AFF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#0063CC] transition-colors shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                    <span>Next: Address Details</span> <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Address Validation */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">Where are we going?</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="021 234 5678" />
                </div>

                <div className="pt-6">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Pickup Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-[18px] h-5 w-5 text-slate-400" />
                    <input required type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} className="w-full bg-[#F5F5F7] border-0 rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="123 Example Street, Tauranga" />
                  </div>
                  {addressError && (
                    <div className="mt-3 flex items-start space-x-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-bold">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span>{addressError}</span>
                    </div>
                  )}
                  <p className="mt-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                    <Info className="w-4 h-4 mr-1 inline" /> Validated against our 20km radius
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-[#F5F5F7] p-4 rounded-xl cursor-pointer">
                  <input type="checkbox" id="sameAsPickup" name="sameAsPickup" checked={formData.sameAsPickup} onChange={handleChange} className="h-5 w-5 rounded border-slate-300 text-[#007AFF] focus:ring-[#007AFF]" />
                  <label htmlFor="sameAsPickup" className="text-sm font-bold text-[#1D1D1F] cursor-pointer">Delivery address is the same as pickup</label>
                </div>

                {!formData.sameAsPickup && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Delivery Address</label>
                    <input required={!formData.sameAsPickup} type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none" placeholder="456 Other Street, Tauranga" />
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="w-1/3 py-4 rounded-xl font-bold text-slate-500 bg-[#F5F5F7] hover:bg-slate-200 transition-colors text-lg">
                    Back
                  </button>
                  <button 
                    type="button" 
                    onClick={handleVerifyAddress}
                    disabled={verifyingAddress}
                    className="w-2/3 flex items-center justify-center space-x-2 bg-[#007AFF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0063CC] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                  >
                    {verifyingAddress ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> <span>Verifying...</span></>
                    ) : (
                      <><span>Next: Schedule</span> <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Schedule */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="bg-green-50 border border-transparent p-6 rounded-2xl flex items-start space-x-4 text-green-800">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-green-500" />
                  <div>
                    <h3 className="font-bold text-lg text-[#1D1D1F]">Address Confirmed</h3>
                    <p className="text-sm font-medium text-slate-600 mt-1">You are within our service area. Select your preferred pickup time.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Preferred Pickup Date</label>
                    <input required type="date" name="date" min={getMinDateString()} value={formData.date} onChange={handleChange} className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Pickup Time Window</label>
                    <select name="timeWindow" value={formData.timeWindow} onChange={handleChange} className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-bold focus:ring-2 focus:ring-[#007AFF] outline-none cursor-pointer">
                      {(bookingRules?.timeWindows || ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00']).map(window => (
                        <option key={window} value={window}>{window}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Special Instructions (Optional)</label>
                  <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows={4} className="w-full bg-[#F5F5F7] border-0 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#007AFF] outline-none resize-none" placeholder="E.g., Please leave bags by the side door if we're not home." />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setStep(2)} className="w-1/3 py-4 rounded-xl font-bold text-slate-500 bg-[#F5F5F7] hover:bg-slate-200 transition-colors text-lg">
                    Back
                  </button>
                  <button type="button" onClick={() => setStep(4)} disabled={!formData.date} className="w-2/3 flex items-center justify-center space-x-2 bg-[#007AFF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0063CC] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                    <span>Next: Review</span> <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review */}
             {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-[#1D1D1F] mb-6">Review your order</h2>

                <div className="bg-[#F5F5F7] rounded-3xl p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Service</span>
                        <span className="font-bold text-[#1D1D1F] capitalize">{selectedService?.name || serviceId} ({bagQuantity}x)</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pickup</span>
                        <span className="font-bold text-[#1D1D1F]">{new Date(formData.date).toLocaleDateString()} @ {formData.timeWindow}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Est. Return</span>
                        <span className="font-bold text-[#007AFF]">{getEstimatedReturnDate(formData.date, bookingRules?.defaultTurnaroundHours || 24)}</span>
                      </div>
                   </div>

                   <div className="border-t border-slate-200 pt-6">
                     <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Price Breakdown</h3>
                     <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-600">Base Cost ({bagQuantity} bags)</span>
                          <span className="font-bold text-[#1D1D1F]">${breakdown.quantityCost}</span>
                        </div>
                        {breakdown.addOnCost > 0 && (
                           <div className="flex justify-between text-sm">
                             <span className="font-medium text-slate-600">Add-ons</span>
                             <span className="font-bold text-[#1D1D1F]">${breakdown.addOnCost}</span>
                           </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-600">Pickup & Delivery</span>
                          <span className="font-bold text-green-600">Free</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center bg-[#1D1D1F] text-white p-6 rounded-2xl shadow-lg">
                        <span className="text-sm font-bold uppercase tracking-widest">Total to Pay</span>
                        <span className="text-3xl font-bold">${breakdown.total}</span>
                     </div>
                   </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button type="button" onClick={() => setStep(3)} className="w-1/3 py-4 rounded-xl font-bold text-slate-500 bg-[#F5F5F7] hover:bg-slate-200 transition-colors text-lg">
                    Back
                  </button>
                  <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-2/3 flex items-center justify-center space-x-2 bg-[#007AFF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0063CC] transition-colors disabled:opacity-70 shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> <span>Finalizing...</span></>
                    ) : (
                      <><span>Confirm Book & Pay</span> <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>
             )}

          </form>
        </div>
      </div>
    </div>
  );
}
