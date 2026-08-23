import React from 'react';
import { useLocation } from 'react-router-dom';
import { CheckIcon, MailIcon, MapPinIcon, TruckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ButtonLink } from '../components/ui/Button';
import { ProductRail } from '../components/product/ProductRail';
import { productById, products } from '../data/products';
import { formatPrice } from '../utils/format';
import type { CartLine, OrderSummaryTotals } from '../types';

interface ConfirmationState {
  lines?: CartLine[];
  totals?: OrderSummaryTotals;
  name?: string;
  email?: string;
  address?: string;
  payment?: string;
}

export function OrderConfirmation() {
  const { state } = useLocation() as {state: ConfirmationState | null;};
  const lines = state?.lines ?? [];
  const totals = state?.totals ?? { subtotal: 0, discount: 0, delivery: 0, total: 0 };
  const orderId = 'TGD-24918';

  return (
    <>
      <section className="border-b border-sand bg-linen">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-24">
          <motion.span
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream">
            
            <CheckIcon className="h-6 w-6" strokeWidth={1.5} />
          </motion.span>
          <p className="eyebrow mt-7 text-clay">Order {orderId}</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight text-ink lg:text-5xl">
            Thank you{state?.name ? `, ${state.name.split(' ')[0]}` : ''} — your pieces are on their
            way
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-smoke">
            We have sent a confirmation to {state?.email ?? 'your email'}. Our studio packs orders
            by hand, so you will get a dispatch note with tracking within 24 hours.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to={`/orders/TGD-24817`}>Track this order</ButtonLink>
            <ButtonLink to="/shop" variant="secondary">
              Continue shopping
            </ButtonLink>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-shell px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-light text-ink">What you ordered</h2>
            <ul className="mt-6 divide-y divide-sand border-y border-sand">
              {lines.map((line) => {
                const product = productById(line.productId);
                if (!product) return null;
                return (
                  <li key={`${line.productId}-${line.color}`} className="flex items-center gap-5 py-5">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-20 w-16 shrink-0 object-cover" />
                    
                    <div className="min-w-0">
                      <p className="text-sm text-ink">{product.name}</p>
                      <p className="mt-1 text-xs text-smoke">
                        {line.color}
                        {line.size ? ` · ${line.size}` : ''} · Qty {line.quantity}
                      </p>
                    </div>
                    <p className="ml-auto text-sm text-ink">
                      {formatPrice(product.price * line.quantity)}
                    </p>
                  </li>);

              })}
              {lines.length === 0 &&
              <li className="py-6 text-sm text-smoke">
                  Order details will appear in My Orders shortly.
                </li>
              }
            </ul>

            <dl className="mt-8 max-w-sm space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd className="text-ink">{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-smoke">Discount</dt>
                <dd className="text-clay">
                  {totals.discount ? `− ${formatPrice(totals.discount)}` : '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-smoke">Delivery</dt>
                <dd className="text-ink">
                  {totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-sand pt-3">
                <dt className="uppercase tracking-widest text-ink">Total paid</dt>
                <dd className="text-ink">{formatPrice(totals.total)}</dd>
              </div>
            </dl>
          </div>

          <aside className="space-y-6">
            <InfoCard
              icon={<TruckIcon className="h-4 w-4" strokeWidth={1.5} />}
              title="Estimated delivery"
              body="Tuesday 25 – Thursday 27 August" />
            
            <InfoCard
              icon={<MapPinIcon className="h-4 w-4" strokeWidth={1.5} />}
              title="Delivering to"
              body={state?.address ?? 'Flat 4B, House 27, Road 11, Dhanmondi, Dhaka 1209'} />
            
            <InfoCard
              icon={<MailIcon className="h-4 w-4" strokeWidth={1.5} />}
              title="Paid with"
              body={state?.payment ?? 'bKash'} />
            
          </aside>
        </div>
      </div>

      <ProductRail
        className="border-t border-sand bg-warmwhite"
        eyebrow="While you wait"
        title="Pieces that pair with your order"
        products={products.filter((p) => p.newArrival)}
        linkTo="/shop/new-arrivals"
        linkLabel="See new arrivals" />
      
    </>);

}

function InfoCard({
  icon,
  title,
  body




}: {icon: React.ReactNode;title: string;body: string;}) {
  return (
    <div className="border border-sand bg-warmwhite p-6">
      <div className="flex items-center gap-2 text-bark">
        {icon}
        <span className="eyebrow">{title}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink">{body}</p>
    </div>);

}