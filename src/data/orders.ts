import type { Order } from '../types';

export const orders: Order[] = [
{
  id: 'TGD-24817',
  date: '14 August 2026',
  status: 'In transit',
  items: [
  { productId: 'p-03', quantity: 2, color: 'Oatmeal' },
  { productId: 'p-05', quantity: 1, color: 'Natural' }],

  totals: { subtotal: 8750, discount: 875, delivery: 120, total: 7995 },
  address: 'Flat 4B, House 27, Road 11, Dhanmondi, Dhaka 1209',
  payment: 'bKash •••• 4417',
  courier: 'Pathao Courier',
  tracking: 'PT-9938-2214'
},
{
  id: 'TGD-24310',
  date: '02 July 2026',
  status: 'Delivered',
  items: [
  { productId: 'p-01', quantity: 1, color: 'Ivory' },
  { productId: 'p-04', quantity: 2, color: 'Sand' }],

  totals: { subtotal: 9200, discount: 0, delivery: 0, total: 9200 },
  address: 'Flat 4B, House 27, Road 11, Dhanmondi, Dhaka 1209',
  payment: 'Visa •••• 2098',
  courier: 'Steadfast',
  tracking: 'SF-1120-8873'
},
{
  id: 'TGD-23755',
  date: '19 May 2026',
  status: 'Delivered',
  items: [{ productId: 'p-02', quantity: 1, color: 'Antique Brass' }],
  totals: { subtotal: 7900, discount: 790, delivery: 150, total: 7260 },
  address: 'Tagdiah Studio pickup — Banani, Dhaka',
  payment: 'Cash on delivery',
  courier: 'Studio pickup',
  tracking: '—'
},
{
  id: 'TGD-23112',
  date: '28 March 2026',
  status: 'Cancelled',
  items: [{ productId: 'p-11', quantity: 1, color: 'Walnut' }],
  totals: { subtotal: 8200, discount: 0, delivery: 150, total: 8350 },
  address: 'Flat 4B, House 27, Road 11, Dhanmondi, Dhaka 1209',
  payment: 'Refunded to bKash',
  courier: '—',
  tracking: '—'
}];


export const orderById = (id: string) => orders.find((order) => order.id === id);

export const customer = {
  name: 'Nusrat Jahan',
  email: 'nusrat.jahan@example.com',
  phone: '+880 1712 004 118',
  since: 'March 2024',
  address: 'Flat 4B, House 27, Road 11, Dhanmondi, Dhaka 1209'
};