import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, EyeIcon } from 'lucide-react';
import { Rating } from '../ui/Rating';
import { useStore } from '../../contexts/StoreContext';
import { useQuickView } from '../QuickViewProvider';
import { cx, discountPercent, formatPrice } from '../../utils/format';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export function ProductCard({ product, layout = 'grid' }: ProductCardProps) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const { open } = useQuickView();
  const wished = isWishlisted(product.id);
  const off = discountPercent(product.price, product.compareAt);

  if (layout === 'list') {
    return (
      <article className="flex gap-6 border-b border-sand pb-8">
        <Link
          to={`/product/${product.slug}`}
          className="w-40 shrink-0 overflow-hidden bg-linen sm:w-52">
          
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 ease-soft hover:scale-[1.03]"
            loading="lazy" />
          
        </Link>
        <div className="flex flex-1 flex-col">
          <p className="eyebrow text-smoke">{product.materials.join(' · ')}</p>
          <h3 className="mt-2 font-display text-2xl font-light text-ink">
            <Link to={`/product/${product.slug}`} className="hover:text-clay">
              {product.name}
            </Link>
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-smoke">
            {product.shortDescription}
          </p>
          <Rating value={product.rating} count={product.reviewCount} className="mt-3" />
          <div className="mt-auto flex items-center gap-4 pt-4">
            <span className="text-lg text-ink">{formatPrice(product.price)}</span>
            {product.compareAt &&
            <span className="text-sm text-smoke/70 line-through">
                {formatPrice(product.compareAt)}
              </span>
            }
            <button
              type="button"
              onClick={() => open(product)}
              className="ml-auto text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-ink/30 transition-colors duration-200 ease-soft hover:text-clay">
              
              Quick view
            </button>
          </div>
        </div>
      </article>);

  }

  return (
    <article className="group flex h-full flex-col">
      <div className="relative overflow-hidden bg-linen">
        <Link to={`/product/${product.slug}`} aria-label={product.name}>
          <div className="aspect-[4/5] w-full">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 ease-soft group-hover:scale-[1.04]"
              loading="lazy" />
            
          </div>
        </Link>

        <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
          {product.badge &&
          <span className="bg-ink px-3 py-1 text-[10px] uppercase tracking-widest text-cream">
              {product.badge}
            </span>
          }
          {off && !product.badge?.includes('%') &&
          <span className="bg-clay px-3 py-1 text-[10px] uppercase tracking-widest text-cream">
              −{off}%
            </span>
          }
        </div>

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-warmwhite/90 text-ink transition-colors duration-200 ease-soft hover:bg-warmwhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
          
          <HeartIcon
            className={cx('h-4 w-4', wished && 'fill-clay text-clay')}
            strokeWidth={1.5} />
          
        </button>

        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 gap-2 opacity-0 transition-[opacity,transform] duration-200 ease-soft group-hover:translate-y-0 group-hover:opacity-100 focus-within:translate-y-0 focus-within:opacity-100">
          <button
            type="button"
            onClick={() =>
            addToCart({
              productId: product.id,
              quantity: 1,
              color: product.colors[0],
              size: product.sizes?.[0]
            })
            }
            className="h-10 flex-1 bg-ink text-[10px] uppercase tracking-widest text-cream transition-colors duration-200 ease-soft hover:bg-clay">
            
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => open(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-10 w-10 items-center justify-center bg-warmwhite text-ink transition-colors duration-200 ease-soft hover:bg-sand">
            
            <EyeIcon className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="eyebrow text-smoke/80">{product.materials.join(' · ')}</p>
        <h3 className="mt-1.5 font-display text-xl font-light leading-snug text-ink">
          <Link to={`/product/${product.slug}`} className="transition-colors duration-200 ease-soft hover:text-clay">
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
        <div className="mt-auto flex items-baseline gap-3 pt-3">
          <span className="text-[15px] text-ink">{formatPrice(product.price)}</span>
          {product.compareAt &&
          <span className="text-[13px] text-smoke/70 line-through">
              {formatPrice(product.compareAt)}
            </span>
          }
        </div>
      </div>
    </article>);

}