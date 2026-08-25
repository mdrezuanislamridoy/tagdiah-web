import React from 'react';
import { useLocation } from 'react-router-dom';
import { CheckIcon, MailIcon, MapPinIcon, TruckIcon, WalletIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ButtonLink } from '../components/ui/Button';
import { ProductRail } from '../components/product/ProductRail';
import { productById, products } from '../data/products';
import { formatPrice } from '../utils/format';
import type { CartLine, OrderSummaryTotals } from '../types';

interface ConfirmationState {
  orderNumber?: string;
  lines?: CartLine[];
  totals?: OrderSummaryTotals;
  name?: string;
  email?: string;
  address?: string;
  payment?: string;
  delivery?: string;
}

export function OrderConfirmation() {
  const { state } = useLocation() as { state: ConfirmationState | null };
  const lines = state?.lines ?? [];
  const totals = state?.totals ?? { subtotal: 0, discount: 0, delivery: 0, total: 0 };
  const orderId = state?.orderNumber || 'TGD-24918';

  return (
    <>
      <section className="border-b border-sand bg-linen">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-24">
          <motion.span
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-cream"
          >
            <CheckIcon className="h-6 w-6" strokeWidth={1.5} />
          </motion.span>
          <p className="eyebrow mt-7 text-clay font-mono">Order #{orderId}</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight text-ink lg:text-5xl">
            Thank you{state?.name ? `, ${state.name.split(' ')[0]}` : ''} — your order is placed
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-smoke max-w-xl mx-auto">
            We have sent a confirmation email to <strong className="text-ink">{state?.email ?? 'your email'}</strong>. Our studio is now carefully preparing your handcrafted pieces.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <ButtonLink to={`/orders/${orderId}`}>Track this order</ButtonLink>
            <ButtonLink to="/account" variant="secondary">
              Go to Dashboard
            </ButtonLink>
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
                      className="h-20 w-16 shrink-0 object-cover border border-sand"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{product.name}</p>
                      <p className="mt-1 text-xs text-smoke">
                        {line.color}
                        {line.size ? ` · ${line.size}` : ''} · Qty {line.quantity}
                      </p>
                    </div>
                    <p className="ml-auto text-sm text-ink font-medium">
                      {formatPrice(product.price * line.quantity)}
                    </p>
                  </li>
                );
              })}
              {lines.length === 0 && (
                <li className="py-6 text-sm text-smoke">
                  Order details have been saved to your account.
                </li>
              )}
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
                  {totals.delivery ? formatPrice(totals.delivery) : 'Free'}
                </dd>
              </div>
              <div className="flex justify-between border-t border-sand pt-4 text-base">
                <dt className="font-display font-light text-ink">Total Due on Delivery (COD)</dt>
                <dd className="font-display font-medium text-ink">{formatPrice(totals.total)}</dd>
              </div>
            </dl>
          </div>

          <aside className="space-y-6">
            <div className="border border-sand bg-warmwhite p-6">
              <div className="flex items-center gap-2 text-bark">
                <MapPinIcon className="h-4 w-4" strokeWidth={1.5} />
                <span className="eyebrow font-semibold">Delivery Address</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink">
                {state?.address ?? 'Dhanmondi, Dhaka 1209'}
              </p>
            </div>

            <div className="border border-sand bg-warmwhite p-6">
              <div className="flex items-center gap-2 text-bark">
                <WalletIcon className="h-4 w-4" strokeWidth={1.5} />
                <span className="eyebrow font-semibold">Payment</span>
              </div>
              <p className="mt-4 text-sm text-ink font-medium">Cash on Delivery (COD)</p>
              <p className="mt-1 text-xs leading-relaxed text-smoke">
                Pay in cash when our courier delivers the package to your doorstep.
              </p>
            </div>

            <div className="border border-sand bg-warmwhite p-6">
              <div className="flex items-center gap-2 text-bark">
                <TruckIcon className="h-4 w-4" strokeWidth={1.5} />
                <span className="eyebrow font-semibold">Courier Partner</span>
              </div>
              <p className="mt-4 text-sm text-ink">Pathao Courier</p>
              <p className="mt-1 text-xs text-smoke">Estimated delivery in 3–5 working days.</p>
            </div>
          </aside>
        </div>
      </div>

      <ProductRail
        eyebrow="Complete your space"
        title="Pieces often paired together"
        products={products.slice(0, 4)}
        className="bg-cream"
      />
    </>
  );
}