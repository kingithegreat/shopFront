import { useState, useMemo } from 'react';
import type { Service } from '../types';
import type { Addon } from './useAddons';

export interface PriceBreakdown {
  basePrice: number;
  quantityCost: number;
  addOnCost: number;
  total: number;
}

export function usePricing(
  services: Service[],
  addons: Addon[],
  initialServiceId?: string,
  initialQuantity = 1,
  initialAddOnIds: string[] = []
) {
  const [serviceId, setServiceId] = useState(initialServiceId || (services.length > 0 ? services[0].id : ''));
  const [bagQuantity, setBagQuantity] = useState(initialQuantity);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(initialAddOnIds);

  const breakdown: PriceBreakdown = useMemo(() => {
    const service = services.find(s => s.id === serviceId);
    const baseServicePrice = service ? service.basePrice : 0;
    const quantityCost = baseServicePrice * bagQuantity;
    
    let addOnCost = 0;
    selectedAddOnIds.forEach(id => {
      const addon = addons.find(a => a.id === id);
      if (addon) {
        addOnCost += addon.price;
      }
    });

    const total = quantityCost + addOnCost;

    return {
      basePrice: baseServicePrice,
      quantityCost,
      addOnCost,
      total
    };
  }, [serviceId, bagQuantity, selectedAddOnIds, services, addons]);

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOnIds(prev => prev.includes(addOnId) ? prev.filter(id => id !== addOnId) : [...prev, addOnId]);
  };

  return {
    serviceId,
    setServiceId,
    bagQuantity,
    setBagQuantity,
    selectedAddOnIds,
    toggleAddOn,
    breakdown,
    selectedService: services.find(s => s.id === serviceId)
  };
}
