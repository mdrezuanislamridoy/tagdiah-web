import React, { useState } from 'react';
import { TagIcon, XIcon } from 'lucide-react';
import { Button, ButtonLink } from '../ui/Button';
import { useStore } from '../../contexts/StoreContext';
import { formatPrice } from '../../utils/format';

interface OrderSummaryProps {
  ctaTo?: string;
  ctaLabel?: string;
  showCoupon?: boolean;
  footnote?: string;
}

export function OrderSummary({
  ctaTo,
  ctaLabel,
  showCoupon = true,
  footnote
}: OrderSummaryProps) {
  const { totals, coupon, couponLabel, couponError, applyCoupon, clearCoupon } = useStore();
  const [code, setCode] = useState('');

  return (
    <div className="border border-sand bg-warmwhite p-6 lg:p-8">
      <h2 className="font-display text-2xl font-light text-ink">Order summary</h2>

      {showCoupon &&
      <div className="mt-6 border-b border-sand pb-6">
          {coupon ?
        <div className="flex items-center gap-3 bg-linen px-4 py-3">
              <TagIcon className="h-4 w-4 text-bark" strokeWidth={1.5} />
              <div className="min-w-0">
                <p className="text-sm text-ink">{coupon}</p>
                <p className="text-xs text-smoke">{couponLabel}</p>
              </div>
              <button
            type="button"
            onClick={clearCoupon}
            aria-label="Remove promo code"
            className="ml-auto text-smoke transition-colors duration-200 ease-soft hover:text-clay">
            
                <XIcon className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div> :

        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyCoupon(code);
          }}>
          
              <label htmlFor="promo" className="eyebrow text-bark">
                Promo code
              </label>
              <div className="mt-3 flex gap-2">
                <input
              id="promo"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="TAGDIAH10"
              className="h-11 flex-1 border border-dune bg-cream px-3 text-sm text-ink placeholder:text-dune focus:border-ink focus:outline-none" />
            
                <Button type="submit" variant="secondary">
                  Apply
                </Button>
              </div>
              {couponError && <p className="mt-2 text-xs text-clay">{couponError}</p>}
            </form>
        }
        </div>
      }

      <dl className="mt-6 space-y-3 text-sm">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        <Row
          label="Discount"
          value={totals.discount ? `− ${formatPrice(totals.discount)}` : '—'}
          accent={totals.discount > 0} />
        
        <Row
          label="Delivery"
          value={totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery)} />
        
      </dl>

      <div className="mt-6 flex items-baseline justify-between border-t border-sand pt-5">
        <span className="text-sm uppercase tracking-widest text-ink">Total</span>
        <span className="font-display text-3xl font-light text-ink">
          {formatPrice(totals.total)}
        </span>
      </div>

      {ctaTo && ctaLabel &&
      <ButtonLink to={ctaTo} size="lg" className="mt-7 w-full">
          {ctaLabel}
        </ButtonLink>
      }
      <p className="mt-4 text-center text-xs leading-relaxed text-smoke">
        {footnote ?? 'Free delivery on orders over ৳5,000. bKash, Nagad, card or cash on delivery.'}
      </p>
    </div>);

}

function Row({ label, value, accent }: {label: string;value: string;accent?: boolean;}) {
  return (
    <div className="flex justify-between">
      <dt className="text-smoke">{label}</dt>
      <dd className={accent ? 'text-clay' : 'text-ink'}>{value}</dd>
    </div>);

}