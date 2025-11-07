
export enum Page {
  Dashboard = 'DASHBOARD',
  Booking = 'BOOKING',
  Boutique = 'BOUTIQUE',
  AIVision = 'AI_VISION',
}

export interface Appointment {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  service: string;
  petName: string;
  addons: string[];
}

export interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
  category: string;
}
