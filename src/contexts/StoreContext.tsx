import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../utils/api';
import type { CartLine, Category, OrderSummaryTotals, Product } from '../types';

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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  /* ── 1. LocalStorage initialized Cart & Wishlist ── */
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [savedForLater, setSavedForLater] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
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

  /* ── 2. Load Real Dynamic Products & Categories from Backend ── */
  const fetchCatalogue = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const [backendProducts, backendCategories] = await Promise.allSettled([
        api.get<any[]>('/products'),
        api.get<any[]>('/categories'),
      ]);

      if (backendCategories.status === 'fulfilled' && Array.isArray(backendCategories.value)) {
        const mappedCategories: Category[] = backendCategories.value.map((c) => ({
          slug: c.slug,
          name: c.name,
          tagline: c.tagline || 'Handcrafted Collection',
          description: c.description || '',
          image: c.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
          count: c._count?.products || 0,
        }));
        setCategories(mappedCategories);
      } else {
        setCategories([]);
      }

      if (backendProducts.status === 'fulfilled' && Array.isArray(backendProducts.value)) {
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
            reviewCount: p.reviews?.length || 0,
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
        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
      setCategories([]);
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
      return products.find((p) => p.id === id);
    },
    [products]
  );

  const productBySlug = useCallback(
    (slug: string) => {
      return products.find((p) => p.slug === slug);
    },
    [products]
  );

  const categoryBySlug = useCallback(
    (slug: string) => {
      return categories.find((c) => c.slug === slug);
    },
    [categories]
  );

  const searchProducts = useCallback(
    (query: string) => {
      if (!query || !query.trim()) return products;
      const q = query.trim().toLowerCase();
      return products.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      });
    },
    [products]
  );

  /* ── 4. Cart & Wishlist Actions ── */
  const addToCart = useCallback((line: CartLine) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.productId === line.productId &&
          item.color === line.color &&
          item.size === line.size
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + line.quantity,
        };
        return next;
      }
      return [...prev, line];
    });
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index] = { ...next[index], quantity };
      return next;
    });
  }, []);

  const removeLine = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const saveForLater = useCallback((index: number) => {
    setCart((prev) => {
      const target = prev[index];
      if (!target) return prev;
      setSavedForLater((s) => [...s, target]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const moveToCart = useCallback((index: number) => {
    setSavedForLater((prev) => {
      const target = prev[index];
      if (!target) return prev;
      addToCart(target);
      return prev.filter((_, i) => i !== index);
    });
  }, [addToCart]);

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

      // Check if coupon has already been redeemed in local browser history
      try {
        const usedCoupons = JSON.parse(localStorage.getItem('tagdiah_used_coupons') || '[]');
        if (Array.isArray(usedCoupons) && usedCoupons.includes(key)) {
          setCoupon(null);
          setCouponDetails(null);
          setCouponError(`Coupon “${key}” has already been redeemed. This discount is valid for 1-time use only.`);
          return;
        }
      } catch {}

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
        setCoupon(null);
        setCouponDetails(null);
        setCouponError(err?.message || `“${code}” is not a valid coupon code.`);
      }
    },
    [cart, productById]
  );

  const clearCoupon = useCallback(() => {
    setCoupon(null);
    setCouponDetails(null);
    setCouponError(null);
  }, []);

  const clearCart = useCallback(() => {
    if (coupon) {
      try {
        const usedCoupons = JSON.parse(localStorage.getItem('tagdiah_used_coupons') || '[]');
        if (!usedCoupons.includes(coupon)) {
          usedCoupons.push(coupon);
          localStorage.setItem('tagdiah_used_coupons', JSON.stringify(usedCoupons));
        }
      } catch {}
    }
    setCart([]);
    setCoupon(null);
    setCouponDetails(null);
    setCouponError(null);
  }, [coupon]);

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
      } else if (couponDetails.type === 'Free Delivery') {
        discount = deliverySettings.insideDhakaFee;
      }
    }

    const freeThreshold = deliverySettings.freeDeliveryThreshold;
    const isFreeDelivery = subtotal >= freeThreshold;
    const delivery = isFreeDelivery ? 0 : deliverySettings.insideDhakaFee;
    const total = Math.max(0, subtotal - discount + delivery);

    return {
      subtotal,
      discount,
      delivery,
      total,
      isFreeDelivery,
      freeThresholdRemaining: Math.max(0, freeThreshold - subtotal),
    };
  }, [cart, couponDetails, deliverySettings, productById]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const wishlistCount = wishlist.length;

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        loadingProducts,
        cart,
        savedForLater,
        wishlist,
        cartCount,
        wishlistCount,
        coupon,
        couponLabel: couponDetails?.label || null,
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
        isWishlisted,
        applyCoupon,
        clearCoupon,
        clearCart,
        refreshCatalogue: fetchCatalogue,
        refreshDeliverySettings: fetchDeliverySettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}