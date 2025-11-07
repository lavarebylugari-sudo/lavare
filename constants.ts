
import { Appointment, Product, Page } from './types';

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
    time: '10:00 AM',
    service: 'The Luxe Wash',
    petName: 'Coco',
    addons: ['Pawdicure', 'Blueberry Facial'],
  },
  {
    id: 2,
    date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    time: '02:30 PM',
    service: 'Glamour Cut & Style',
    petName: 'Rocky',
    addons: [],
  },
  {
    id: 3,
    date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    time: '11:00 AM',
    service: 'Vitality Spa Day',
    petName: 'Luna',
    addons: ['Aromatherapy'],
  },
];


export const BOUTIQUE_PRODUCTS: Product[] = [
    { id: 1, name: 'Lavender Bliss Pet Candle', price: '$28.00', imageUrl: 'https://picsum.photos/id/1025/400/400', category: 'Home Ambiance' },
    { id: 2, name: 'Artisanal Liver Treats', price: '$15.00', imageUrl: 'https://picsum.photos/id/237/400/400', category: 'Gourmet Treats' },
    { id: 3, name: 'Golden Weave Collar', price: '$45.00', imageUrl: 'https://picsum.photos/id/1074/400/400', category: 'Pet Gear' },
    { id: 4, name: 'Organic Oatmeal Shampoo', price: '$22.00', imageUrl: 'https://picsum.photos/id/1084/400/400', category: 'Grooming' },
    { id: 5, name: 'Plush Velvet Pet Bed', price: '$120.00', imageUrl: 'https://picsum.photos/id/219/400/400', category: 'Pet Gear' },
    { id: 6, name: 'Rosemary Mint Pet Cologne', price: '$18.00', imageUrl: 'https://picsum.photos/id/390/400/400', category: 'Grooming' },
];

export const NAV_ITEMS = [
    { page: Page.Dashboard, label: 'Dashboard' },
    { page: Page.Booking, label: 'Book Now' },
    { page: Page.Boutique, label: 'Boutique' },
    { page: Page.AIVision, label: 'AI Stylist' },
];

export const LAVARE_MEANING = [
    { letter: 'L', word: 'Lugari', description: 'Celebrating our heritage and a family name synonymous with care.' },
    { letter: 'A', word: 'App', description: 'A seamless, modern digital experience for our treasured clients.' },
    { letter: 'V', word: 'Vitality', description: 'Promoting the health, energy, and vibrant spirit of every pet.' },
    { letter: 'E', word: 'Elegance', description: 'A luxury, boutique feel in every service, product, and interaction.' },
    { letter: 'R', word: 'Retreat', description: 'A sanctuary of pampering, relaxation, and expert care for your companion.' },
    { letter: 'I', word: 'Innovation', description: 'Forward-thinking techniques and technology to provide the best for your pet.' },
];
