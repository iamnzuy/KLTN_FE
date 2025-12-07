import { type MenuConfig } from '@/types/menu';
import { Home, Pyramid, Salad, Search, Hourglass, Tag } from 'lucide-react';

export const MAIN_MENU: MenuConfig = [
  {
    title: 'Home',
    path: '/',
    icon: Home,
  },
  { 
    title: 'My Orders', 
    icon: Hourglass,
    path: '/my-orders' 
  },
  { 
    title: 'Order Receipt', 
    icon: Pyramid,
    path: '/order-receipt' 
  }
];

export const GENERAL_SETTINGS = {
  purchaseLink: '#',
  docsLink: 'https://docs.keenthemes.com/storely',
};