/** `estate_owner` is the sole platform super-admin; listings require their approval to go public. */
export type UserRole = 'user' | 'agent' | 'estate_owner';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export interface Property {
  id: string;
  title: string;
  price: number;
  /** Defaults to PKR (Pakistan market). */
  priceCurrency?: 'PKR' | 'USD';
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    lat: number;
    lng: number;
  };
  type: 'buy' | 'rent' | 'luxury' | 'commercial';
  category: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  yearBuilt: number;
  parking: number;
  lotSize?: number;
  images: string[];
  description: string;
  features: string[];
  agent: Agent;
  featured?: boolean;
  status: 'available' | 'pending' | 'sold';
  // User-listing fields
  ownerId?: string; // user id who created it (if user-uploaded)
  approvalStatus?: ListingStatus;
  createdAt?: number;
}

export interface Agent {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  rating: number;
  specialization: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  photo: string;
  quote: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  email: string;
  linkedin?: string;
  twitter?: string;
}

export interface FilterOptions {
  priceRange: [number, number];
  location: string;
  propertyType: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  amenities: string[];
}