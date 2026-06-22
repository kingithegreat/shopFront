export type UserRole = 'customer' | 'admin' | 'owner';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: number;
}

export type PriceType = 'per_bag' | 'per_item' | 'flat_fee' | 'hourly';

export interface Service {
  id?: string;
  name: string;
  description: string;
  basePrice: number;
  priceType: PriceType;
  estimatedTurnaround: string;
  icon: string;
  active: boolean;
  displayOrder: number;
}

export interface Addon {
  id?: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  applicableServices: string[]; // array of service IDs
}

export interface PromoCode {
  id?: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  expiryDate: string; // YYYY-MM-DD
  usageLimit: number;
  timesUsed: number;
  active: boolean;
  applicableServices: string[];
}

export type OrderStatus = 
  | 'pending_payment'
  | 'confirmed'
  | 'pickup_scheduled'
  | 'driver_assigned'
  | 'picked_up'
  | 'washing'
  | 'ready_for_delivery'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupDate: string; // ISO format string YYYY-MM-DD
  pickupTimeWindow: string; // e.g., '09:00 - 11:00'
  serviceType: 'washAndFold' | 'bedding' | 'towels';
  bagQuantity: number;
  addOns: string[]; // e.g., ['ironing']
  specialInstructions: string;
  estimatedPrice: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: number;
  updatedAt: number;
}
