export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline?: string;
  description?: string;
  image: string;
  count?: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  location?: string;
  rating: number;
  date?: string;
  title?: string;
  body: string;
  verified?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badge?: string;
  colors: string[];
  materials: string[];
  sizes?: string[];
  availability: 'in-stock' | 'low-stock' | 'made-to-order';
  shortDescription?: string;
  description?: string;
  story?: string;
  specs?: ProductSpec[];
  popularity: number;
  createdAt: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  completeTheLook?: string[];
}

export interface CartLine {
  productId: string;
  quantity: number;
  color: string;
  size?: string;
}

export interface OrderSummaryTotals {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'In transit' | 'Processing' | 'Confirmed' | 'Pending' | 'Shipped' | 'Cancelled';
  items: { productId: string; quantity: number; color: string; }[];
  totals: OrderSummaryTotals;
  address: string;
  payment: string;
  courier: string;
  tracking: string;
}