import { PRICING } from '../lib/utils';
import type { Booking } from '../types';

export interface PriceBreakdown {
  basePrice: number;
  quantityCost: number;
  addOnCost: number;
  total: number;
}

export function calculatePrice(
  serviceType: 'washAndFold' | 'bedding' | 'towels',
  bagQuantity: number,
  addOns: string[]
): PriceBreakdown {
  const baseServicePrice = PRICING[serviceType];
  const quantityCost = baseServicePrice * bagQuantity;
  const addOnCost = addOns.includes('ironing') ? PRICING.ironing : 0;
  const total = quantityCost + addOnCost;

  return {
    basePrice: baseServicePrice,
    quantityCost,
    addOnCost,
    total
  };
}

// Helpers for estimated dates
export function getEstimatedReturnDate(pickupDateString: string, turnaroundHours: number = 48): string {
  if (!pickupDateString) return '';
  const date = new Date(pickupDateString);
  const addDays = Math.max(1, Math.ceil(turnaroundHours / 24));
  date.setDate(date.getDate() + addDays);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}
