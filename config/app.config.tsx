import { type MenuConfig } from '@/types/menu';
import { Home, Hourglass } from 'lucide-react';

export const MAIN_MENU: MenuConfig = [
  {
    title: 'Trang chủ',
    path: '/',
    icon: Home,
  },
  { 
    title: 'Đơn hàng của tôi', 
    icon: Hourglass,
    path: '/my-orders' 
  }
];

export const GENERAL_SETTINGS = {
  purchaseLink: '#',
  docsLink: 'https://docs.keenthemes.com/storely',
};