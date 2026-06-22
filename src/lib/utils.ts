import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tauranga Crossing Coordinates
export const CENTRAL_LAT = -37.7016;
export const CENTRAL_LNG = 176.1489;
export const MAX_RADIUS_KM = 20;

export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Mock geocoder for MVP
// Real implementation would use Google Maps Geocoding API
export async function mockGeocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const lcAddress = address.toLowerCase();
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Some mock addresses within Tauranga
  if (lcAddress.includes('tauranga') || lcAddress.includes('mount maunganui') || lcAddress.includes('papamoa')) {
    // Provide a random coordinate within ~15km
    const randomLatOffset = (Math.random() - 0.5) * 0.2;
    const randomLngOffset = (Math.random() - 0.5) * 0.2;
    return {
      lat: CENTRAL_LAT + randomLatOffset,
      lng: CENTRAL_LNG + randomLngOffset
    };
  } else if (lcAddress.includes('auckland') || lcAddress.includes('wellington')) {
    return { lat: -36.8485, lng: 174.7633 }; // Outside radius
  }

  // Fallback default within radius
  return { lat: CENTRAL_LAT + 0.05, lng: CENTRAL_LNG + 0.05 };
}

export const PRICING = {
  washAndFold: 25,
  bedding: 35,
  towels: 20,
  ironing: 15,
};
