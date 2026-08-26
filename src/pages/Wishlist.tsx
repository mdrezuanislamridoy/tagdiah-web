import { Link, Navigate } from 'react-router-dom';
import { HeartIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Rating } from '../components/ui/Rating';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { availabilityLabel, formatPrice } from '../utils/format';

export function Wishlist() {
  const { isAuthenticated } = useAuth();
  const { wishlist, toggleWishlist, addToCart, productById } = useStore();

  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/wishlist" replace />;
  }
  const items = wishlist.map(productById).filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow={`${items.length} saved ${items.length === 1 ? 'piece' : 'pieces'}`}
        title="Wishlist"
        intro="Saved pieces stay here for as long as you need. We will tell you if something is close to selling out."
        crumbs={[{ label: 'Wishlist' }]} />
      

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        {items.length === 0 ?
        <EmptyState
          icon={<HeartIcon className="h-6 w-6" strokeWidth={1.5} />}
          title="Nothing saved yet"
          body="Tap the heart on any piece to keep it here while you decide."
          actionLabel="Browse the collection"
          actionTo="/shop" /> :


        <ul className="divide-y divide-sand border-y border-sand">
            {items.map((product) => {
            if (!product) return null;
            return (
              <li key={product.id} className="flex flex-wrap items-center gap-6 py-7">
                  <Link
                  to={`/product/${product.slug}`}
                  className="h-32 w-28 shrink-0 overflow-hidden bg-linen">
                  
                    <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover" />
                  
                  </Link>

                  <div className="min-w-[200px] flex-1">
                    <h2 className="font-display text-xl font-light text-ink">
                      <Link to={`/product/${product.slug}`} className="hover:text-clay">
                        {product.name}
                      </Link>
                    </h2>
                    <Rating value={product.rating} count={product.reviewCount} className="mt-2" />
                    <p className="mt-2 text-xs text-bark">{availabilityLabel[product.availability]}</p>
                  </div>

                  <p className="text-[15px] text-ink">{formatPrice(product.price)}</p>

                  <div className="flex items-center gap-3">
                    <Button
                    variant="secondary"
                    onClick={() =>
                    addToCart({
                      productId: product.id,
                      quantity: 1,
                      color: product.colors[0],
                      size: product.sizes?.[0]
                    })
                    }>
                    
                      Add to cart
                    </Button>
                    <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="flex h-10 w-10 items-center justify-center border border-sand text-smoke transition-colors duration-200 ease-soft hover:border-ink hover:text-clay">
                    
                      <XIcon className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </li>);

          })}
          </ul>
        }
      </div>
    </>);

}