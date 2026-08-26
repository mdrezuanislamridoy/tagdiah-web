import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { products as initialProducts, productById as fallbackProductById, productBySlug as fallbackProductBySlug } from '../data/products';
import { categories as initialCategories, categoryBySlug as fallbackCategoryBySlug } from '../data/categories';
import { api } from '../utils/api';
import type { CartLine, Category, OrderSummaryTotals, Product } from '../types';

const COUPONS: Record<string, { rate: number; label: string }> = {
  TAGDIAH10: { rate: 0.1, label: '10% welcome discount' },
  MONSOON15: { rate: 0.15, label: '15% monsoon collection' },
  ARTISAN20: { rate: 0.2, label: '20% handcrafted celebration' },
};

const CART_KEY = 'tagdiah_cart';
const SAVED_KEY = 'tagdiah_saved';
const WISHLIST_KEY = 'tagdiah_wishlist';

export interface DeliverySettings {
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeDeliveryThreshold: number;
  defaultCourier: string;
  estimatedTime: string;
  options: Array<{
    id: string;
    label: string;
    body: string;
    price: number;
    active: boolean;
  }>;
}

interface StoreValue {
  products: Product[];
  categories: Category[];
  loadingProducts: boolean;
  cart: CartLine[];
  savedForLater: CartLine[];
  wishlist: string[];
  cartCount: number;
  wishlistCount: number;
  coupon: string | null;
  couponLabel: string | null;
  couponError: string | null;
  totals: OrderSummaryTotals;
  deliverySettings: DeliverySettings;
  productById: (id: string) => Product | undefined;
  productBySlug: (slug: string) => Product | undefined;
  categoryBySlug: (slug: string) => Category | undefined;
  searchProducts: (query: string) => Product[];
  addToCart: (line: CartLine) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeLine: (index: number) => void;
  saveForLater: (index: number) => void;
  moveToCart: (index: number) => void;
  removeSaved: (index: number) => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  applyCoupon: (code: string) => void;
  clearCoupon: () => void;
  clearCart: () => void;
  refreshCatalogue: () => Promise<void>;
  refreshDeliverySettings: () => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  /* ── 1. LocalStorage initialized Cart & Wishlist ── */
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { productId: 'p-03', quantity: 2, color: 'Oatmeal', size: '7 ft — Door' },
      { productId: 'p-04', quantity: 1, color: 'Sand', size: 'Tall — 28 cm' },
    ];
  });

  const [savedForLater, setSavedForLater] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [{ productId: 'p-10', quantity: 1, color: 'Terracotta' }];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['p-01', 'p-07', 'p-11'];
  });

  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponDetails, setCouponDetails] = useState<{
    code: string;
    type: string;
    amount: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  /* Dynamic Delivery Settings State */
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    insideDhakaFee: 120,
    outsideDhakaFee: 150,
    freeDeliveryThreshold: 5000,
    defaultCourier: 'Pathao Courier',
    estimatedTime: '2–4 business days',
    options: [
      { id: 'standard', label: 'Standard Doorstep Delivery', body: '3–5 working days across Bangladesh', price: 120, active: true },
      { id: 'express', label: 'Express Dhaka Delivery', body: 'Guaranteed 24–48 hours in Dhaka metro', price: 200, active: true },
      { id: 'pickup', label: 'Studio Collection (Savar)', body: 'Ready next business day · Free', price: 0, active: true },
    ],
  });

  const fetchDeliverySettings = useCallback(async () => {
    try {
      const data = await api.get<any>('/settings/delivery');
      if (data) {
        setDeliverySettings({
          insideDhakaFee: data.insideDhakaFee ?? 120,
          outsideDhakaFee: data.outsideDhakaFee ?? 150,
          freeDeliveryThreshold: data.freeDeliveryThreshold ?? 5000,
          defaultCourier: data.defaultCourier || 'Pathao Courier',
          estimatedTime: data.estimatedTime || '2–4 business days',
          options: data.options || [],
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchDeliverySettings();
  }, [fetchDeliverySettings]);

  /* Sync Cart / Wishlist to LocalStorage */
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(savedForLater));
    } catch {}
  }, [savedForLater]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  /* ── 2. Load Dynamic Products & Categories from Backend ── */
  const fetchCatalogue = useCallback(async () => {
    try {
      const [backendProducts, backendCategories] = await Promise.allSettled([
        api.get<any[]>('/products'),
        api.get<any[]>('/categories'),
      ]);

      if (backendCategories.status === 'fulfilled' && Array.isArray(backendCategories.value) && backendCategories.value.length > 0) {
        const mappedCategories: Category[] = backendCategories.value.map((c) => ({
          slug: c.slug,
          name: c.name,
          tagline: c.tagline || 'Handcrafted Collection',
          description: c.description || '',
          image: c.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
          count: c._count?.products || 0,
        }));
        setCategories(mappedCategories);
      }

      if (backendProducts.status === 'fulfilled' && Array.isArray(backendProducts.value) && backendProducts.value.length > 0) {
        const mappedProducts: Product[] = backendProducts.value.map((p) => {
          let images: string[] = [];
          try {
            images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
          } catch {
            images = [p.images || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'];
          }

          let colors: string[] = ['Natural'];
          try {
            if (p.colors) colors = typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors;
          } catch {}

          let materials: string[] = ['Handcrafted'];
          try {
            if (p.materials) materials = typeof p.materials === 'string' ? JSON.parse(p.materials) : p.materials;
          } catch {}

          let sizes: string[] = [];
          try {
            if (p.sizes) sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
          } catch {}

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: p.category?.slug || p.categoryId || 'decor',
            price: p.price,
            compareAt: p.compareAt || undefined,
            discountPrice: p.discountPrice || undefined,
            rating: 4.9,
            reviewCount: p.reviews?.length || 12,
            images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200'],
            badge: p.badge || (p.featured ? 'Featured' : undefined),
            colors,
            materials,
            sizes,
            availability: (p.availability as any) || 'in-stock',
            shortDescription: p.description || '',
            description: p.description || '',
            story: p.story || 'Handcrafted by generational artisans with natural materials.',
            popularity: p.popularity || 90,
            createdAt: p.createdAt || new Date().toISOString(),
            bestSeller: p.badge === 'Bestseller',
            newArrival: p.badge === 'New Arrival',
          };
        });

        // Merge backend products with fallback products for rich display
        const combined = [...mappedProducts];
        initialProducts.forEach((ip) => {
          if (!combined.some((cp) => cp.id === ip.id || cp.slug === ip.slug)) {
            combined.push(ip);
          }
        });
        setProducts(combined);
      }
    } catch {
      // Fallback remains initial data
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogue();
  }, [fetchCatalogue]);

  /* ── 3. Lookup & Search Helpers ── */
  const productById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id) || fallbackProductById(id);
    },
    [products]
  );

  const productBySlug = useCallback(
    (slug: string) => {
      return products.find((p) => p.slug === slug) || fallbackProductBySlug(slug);
    },
    [products]
  );

  const categoryBySlug = useCallback(
    (slug: string) => {
      return categories.find((c) => c.slug === slug) || fallbackCategoryBySlug(slug);
    },
    [categories]
  );

  const searchProducts = useCallback(
    (query: string) => {
      if (!query || !query.trim()) return products;
      const q = query.trim().toLowerCase();
      return products.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = (p.description || p.shortDescription || '').toLowerCase().includes(q);
        const catMatch = p.category.toLowerCase().includes(q);
        const matMatch = p.materials.some((m) => m.toLowerCase().includes(q));
        const colMatch = p.colors.some((c) => c.toLowerCase().includes(q));
        return nameMatch || descMatch || catMatch || matMatch || colMatch;
      });
    },
    [products]
  );

  /* ── 4. Cart & Wishlist Actions ── */
  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const match = prev.findIndex(
        (l) => l.productId === line.productId && l.color === line.color && l.size === line.size
      );
      if (match > -1) {
        const next = [...prev];
        next[match] = { ...next[match], quantity: next[match].quantity + line.quantity };
        return next;
      }
      return [...prev, line];
    });
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setCart((prev) =>
      prev.map((line, i) => (i === index ? { ...line, quantity: Math.max(1, quantity) } : line))
    );
  }, []);

  const removeLine = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const saveForLater = useCallback((index: number) => {
    setCart((prev) => {
      const line = prev[index];
      if (line) setSavedForLater((saved) => [...saved, line]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const moveToCart = useCallback((index: number) => {
    setSavedForLater((prev) => {
      const line = prev[index];
      if (line) setCart((c) => [...c, line]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const removeSaved = useCallback((index: number) => {
    setSavedForLater((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  const applyCoupon = useCallback(
    async (code: string) => {
      const key = code.trim().toUpperCase();
      if (!key) return;

      const currentSubtotal = cart.reduce((sum, line) => {
        const product = productById(line.productId);
        return sum + (product ? product.price * line.quantity : 0);
      }, 0);

      try {
        const data = await api.post<any>('/coupons/validate', {
          code: key,
          subtotal: currentSubtotal,
        });

        if (data?.valid) {
          setCoupon(data.code);
          setCouponDetails(data);
          setCouponError(null);
        }
      } catch (err: any) {
        // Fallback for offline default coupon keys
        if (COUPONS[key]) {
          setCoupon(key);
          setCouponDetails({
            code: key,
            type: 'Percentage',
            amount: COUPONS[key].rate * 100,
            label: COUPONS[key].label,
          });
          setCouponError(null);
        } else {
          setCoupon(null);
          setCouponDetails(null);
          setCouponError(err?.message || `“${code}” is not a valid coupon code.`);
        }
      }
    },
    [cart, productById]
  );

  const clearCoupon = useCallback(() => {
    setCoupon(null);
    setCouponDetails(null);
    setCouponError(null);
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  /* ── 5. Dynamic Totals Calculation ── */
  const totals = useMemo<OrderSummaryTotals>(() => {
    const subtotal = cart.reduce((sum, line) => {
      const product = productById(line.productId);
      return sum + (product ? product.price * line.quantity : 0);
    }, 0);

    let discount = 0;
    if (couponDetails) {
      if (couponDetails.type === 'Percentage') {
        discount = Math.round((subtotal * couponDetails.amount) / 100);
      } else if (couponDetails.type === 'Fixed') {
        discount = Math.min(subtotal, couponDetails.amount);
      }
    } else if (coupon && COUPONS[coupon]) {
      discount = Math.round(subtotal * COUPONS[coupon].rate);
    }

    const freeThreshold = deliverySettings.freeDeliveryThreshold || 5000;
    const defaultFee = deliverySettings.insideDhakaFee ?? 120;
    let delivery = subtotal === 0 || subtotal - discount >= freeThreshold ? 0 : defaultFee;
    if (couponDetails?.type === 'Free Delivery') {
      delivery = 0;
    }

    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
  }, [cart, coupon, couponDetails, productById, deliverySettings]);

  const value = useMemo<StoreValue>(
    () => ({
      products,
      categories,
      loadingProducts,
      cart,
      savedForLater,
      wishlist,
      cartCount: cart.reduce((n, l) => n + l.quantity, 0),
      wishlistCount: wishlist.length,
      coupon,
      couponLabel: couponDetails?.label || (coupon ? COUPONS[coupon]?.label : null),
      couponError,
      totals,
      deliverySettings,
      productById,
      productBySlug,
      categoryBySlug,
      searchProducts,
      addToCart,
      updateQuantity,
      removeLine,
      saveForLater,
      moveToCart,
      removeSaved,
      toggleWishlist,
      isWishlisted: (id: string) => wishlist.includes(id),
      applyCoupon,
      clearCoupon,
      clearCart,
      refreshCatalogue: fetchCatalogue,
      refreshDeliverySettings: fetchDeliverySettings,
    }),
    [
      products,
      categories,
      loadingProducts,
      cart,
      savedForLater,
      wishlist,
      coupon,
      couponError,
      totals,
      deliverySettings,
      productById,
      productBySlug,
      categoryBySlug,
      searchProducts,
      addToCart,
      updateQuantity,
      removeLine,
      saveForLater,
      moveToCart,
      removeSaved,
      toggleWishlist,
      applyCoupon,
      clearCoupon,
      clearCart,
      fetchCatalogue,
      fetchDeliverySettings,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}