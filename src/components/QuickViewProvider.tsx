import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { Rating } from './ui/Rating';
import { Button } from './ui/Button';
import { useStore } from '../contexts/StoreContext';
import { availabilityLabel, cx, formatPrice } from '../utils/format';
import type { Product } from '../types';

interface QuickViewValue {
  open: (product: Product) => void;
  close: () => void;
}

const QuickViewContext = createContext<QuickViewValue | null>(null);

export function QuickViewProvider({ children }: {children: React.ReactNode;}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [color, setColor] = useState<string>('');
  const { addToCart } = useStore();

  const open = useCallback((next: Product) => {
    setProduct(next);
    setColor(next.colors[0]);
  }, []);
  const close = useCallback(() => setProduct(null), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {product &&
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          
            <button
            type="button"
            aria-label="Close quick view"
            onClick={close}
            className="absolute inset-0 bg-ink/50" />
          
            <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} quick view`}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="relative grid w-full max-w-4xl grid-cols-1 bg-warmwhite sm:grid-cols-2">
            
              <button
              type="button"
              onClick={close}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-warmwhite/90 text-ink transition-colors duration-200 ease-soft hover:bg-sand">
              
                <XIcon className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <div className="aspect-square bg-linen">
                <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover" />
              
              </div>
              <div className="flex flex-col p-7 sm:p-9">
                <p className="eyebrow text-clay">{availabilityLabel[product.availability]}</p>
                <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink">
                  {product.name}
                </h2>
                <Rating value={product.rating} count={product.reviewCount} className="mt-3" />
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-xl text-ink">{formatPrice(product.price)}</span>
                  {product.compareAt &&
                <span className="text-sm text-smoke/70 line-through">
                      {formatPrice(product.compareAt)}
                    </span>
                }
                </div>
                <p className="mt-4 text-sm leading-relaxed text-smoke">
                  {product.shortDescription}
                </p>

                <fieldset className="mt-6">
                  <legend className="eyebrow mb-3 text-smoke">Colour — {color}</legend>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((option) =>
                  <button
                    key={option}
                    type="button"
                    onClick={() => setColor(option)}
                    className={cx(
                      'border px-4 py-2 text-xs transition-colors duration-200 ease-soft',
                      option === color ?
                      'border-ink bg-ink text-cream' :
                      'border-sand text-smoke hover:border-ink hover:text-ink'
                    )}>
                    
                        {option}
                      </button>
                  )}
                  </div>
                </fieldset>

                <div className="mt-auto flex flex-col gap-3 pt-8">
                  <Button
                  onClick={() => {
                    addToCart({
                      productId: product.id,
                      quantity: 1,
                      color,
                      size: product.sizes?.[0]
                    });
                    close();
                  }}>
                  
                    Add to cart
                  </Button>
                  <Link
                  to={`/product/${product.slug}`}
                  onClick={close}
                  className="text-center text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-ink/30 transition-colors duration-200 ease-soft hover:text-clay">
                  
                    View full details
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </QuickViewContext.Provider>);

}

export function useQuickView(): QuickViewValue {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error('useQuickView must be used within a QuickViewProvider');
  return ctx;
}