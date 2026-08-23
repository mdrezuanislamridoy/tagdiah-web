import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkIcon, MinusIcon, PlusIcon, ShoppingBagIcon, Trash2Icon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { OrderSummary } from '../components/cart/OrderSummary';
import { ProductRail } from '../components/product/ProductRail';
import { useStore } from '../contexts/StoreContext';
import { productById, products } from '../data/products';
import { formatPrice } from '../utils/format';

export function Cart() {
  const { cart, savedForLater, updateQuantity, removeLine, saveForLater, moveToCart, removeSaved } =
  useStore();

  return (
    <>
      <PageHeader
        eyebrow={`${cart.length} ${cart.length === 1 ? 'line' : 'lines'} in your bag`}
        title="Shopping cart"
        crumbs={[{ label: 'Cart' }]} />
      

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        {cart.length === 0 ?
        <EmptyState
          icon={<ShoppingBagIcon className="h-6 w-6" strokeWidth={1.5} />}
          title="Your cart is empty"
          body="Nothing here yet. Start with the best sellers — they are the pieces customers come back for."
          actionLabel="Shop the collection"
          actionTo="/shop" /> :


        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div>
              <ul className="divide-y divide-sand border-y border-sand">
                {cart.map((line, index) => {
                const product = productById(line.productId);
                if (!product) return null;
                return (
                  <li key={`${line.productId}-${line.color}-${line.size}`} className="flex gap-5 py-7">
                      <Link
                      to={`/product/${product.slug}`}
                      className="h-28 w-24 shrink-0 overflow-hidden bg-linen sm:h-36 sm:w-32">
                      
                        <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover" />
                      
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h2 className="font-display text-xl font-light text-ink">
                              <Link to={`/product/${product.slug}`} className="hover:text-clay">
                                {product.name}
                              </Link>
                            </h2>
                            <p className="mt-1.5 text-xs text-smoke">
                              {line.color}
                              {line.size ? ` · ${line.size}` : ''}
                            </p>
                          </div>
                          <p className="text-[15px] text-ink">
                            {formatPrice(product.price * line.quantity)}
                          </p>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
                          <div className="flex h-10 items-center border border-sand">
                            <button
                            type="button"
                            onClick={() => updateQuantity(index, line.quantity - 1)}
                            aria-label={`Decrease quantity of ${product.name}`}
                            className="flex h-full w-9 items-center justify-center text-ink hover:bg-linen">
                            
                              <MinusIcon className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                            <span className="w-8 text-center text-sm text-ink">{line.quantity}</span>
                            <button
                            type="button"
                            onClick={() => updateQuantity(index, line.quantity + 1)}
                            aria-label={`Increase quantity of ${product.name}`}
                            className="flex h-full w-9 items-center justify-center text-ink hover:bg-linen">
                            
                              <PlusIcon className="h-3 w-3" strokeWidth={1.5} />
                            </button>
                          </div>

                          <button
                          type="button"
                          onClick={() => saveForLater(index)}
                          className="flex items-center gap-1.5 text-xs text-smoke transition-colors duration-200 ease-soft hover:text-ink">
                          
                            <BookmarkIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Save for later
                          </button>
                          <button
                          type="button"
                          onClick={() => removeLine(index)}
                          className="flex items-center gap-1.5 text-xs text-smoke transition-colors duration-200 ease-soft hover:text-clay">
                          
                            <Trash2Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>);

              })}
              </ul>

              {savedForLater.length > 0 &&
            <div className="mt-12">
                  <h2 className="font-display text-2xl font-light text-ink">Saved for later</h2>
                  <ul className="mt-5 divide-y divide-sand border-y border-sand">
                    {savedForLater.map((line, index) => {
                  const product = productById(line.productId);
                  if (!product) return null;
                  return (
                    <li key={`${line.productId}-saved`} className="flex items-center gap-5 py-5">
                          <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-20 w-16 shrink-0 object-cover" />
                      
                          <div className="min-w-0">
                            <p className="text-sm text-ink">{product.name}</p>
                            <p className="mt-1 text-xs text-smoke">{formatPrice(product.price)}</p>
                          </div>
                          <div className="ml-auto flex items-center gap-4">
                            <button
                          type="button"
                          onClick={() => moveToCart(index)}
                          className="text-xs uppercase tracking-widest text-ink underline underline-offset-4 hover:text-clay">
                          
                              Move to cart
                            </button>
                            <button
                          type="button"
                          onClick={() => removeSaved(index)}
                          aria-label={`Remove ${product.name} from saved items`}
                          className="text-smoke hover:text-clay">
                          
                              <Trash2Icon className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          </div>
                        </li>);

                })}
                  </ul>
                </div>
            }

              <Link
              to="/shop"
              className="mt-10 inline-block text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 decoration-ink/30 hover:text-clay">
              
                Continue shopping
              </Link>
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <OrderSummary ctaTo="/checkout" ctaLabel="Proceed to checkout" />
            </div>
          </div>
        }
      </div>

      <ProductRail
        className="border-t border-sand bg-warmwhite"
        eyebrow="Frequently added"
        title="Pieces that finish the room"
        products={products.filter((p) => p.bestSeller)}
        linkTo="/shop"
        linkLabel="Shop all" />
      
    </>);

}