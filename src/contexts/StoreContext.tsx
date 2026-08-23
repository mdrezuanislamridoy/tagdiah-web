import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { productById } from '../data/products';
import type { CartLine, OrderSummaryTotals } from '../types';

const COUPONS: Record<string, {rate: number;label: string;}> = {
  TAGDIAH10: { rate: 0.1, label: '10% welcome discount' },
  MONSOON15: { rate: 0.15, label: '15% monsoon collection' }
};

interface StoreValue {
  cart: CartLine[];
  savedForLater: CartLine[];
  wishlist: string[];
  cartCount: number;
  coupon: string | null;
  couponLabel: string | null;
  couponError: string | null;
  totals: OrderSummaryTotals;
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
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: {children: React.ReactNode;}) {
  const [cart, setCart] = useState<CartLine[]>([
  { productId: 'p-03', quantity: 2, color: 'Oatmeal', size: '7 ft — Door' },
  { productId: 'p-04', quantity: 1, color: 'Sand', size: 'Tall — 28 cm' }]
  );
  const [savedForLater, setSavedForLater] = useState<CartLine[]>([
  { productId: 'p-10', quantity: 1, color: 'Terracotta' }]
  );
  const [wishlist, setWishlist] = useState<string[]>(['p-01', 'p-07', 'p-11']);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

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
    prev.map((line, i) => i === index ? { ...line, quantity: Math.max(1, quantity) } : line)
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

  const applyCoupon = useCallback((code: string) => {
    const key = code.trim().toUpperCase();
    if (COUPONS[key]) {
      setCoupon(key);
      setCouponError(null);
    } else {
      setCoupon(null);
      setCouponError(`“${code}” isn’t a valid code. Try TAGDIAH10.`);
    }
  }, []);

  const clearCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totals = useMemo<OrderSummaryTotals>(() => {
    const subtotal = cart.reduce((sum, line) => {
      const product = productById(line.productId);
      return sum + (product ? product.price * line.quantity : 0);
    }, 0);
    const discount = coupon ? Math.round(subtotal * COUPONS[coupon].rate) : 0;
    const delivery = subtotal === 0 || subtotal - discount >= 5000 ? 0 : 120;
    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
  }, [cart, coupon]);

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      savedForLater,
      wishlist,
      cartCount: cart.reduce((n, l) => n + l.quantity, 0),
      coupon,
      couponLabel: coupon ? COUPONS[coupon].label : null,
      couponError,
      totals,
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
      clearCart
    }),
    [
    cart,
    savedForLater,
    wishlist,
    coupon,
    couponError,
    totals,
    addToCart,
    updateQuantity,
    removeLine,
    saveForLater,
    moveToCart,
    removeSaved,
    toggleWishlist,
    applyCoupon,
    clearCoupon,
    clearCart]

  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}