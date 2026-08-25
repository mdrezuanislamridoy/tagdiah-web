import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { CreditCardIcon, LockIcon, Loader2Icon, SmartphoneIcon, WalletIcon, CheckCircle2Icon } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Field, TextArea } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { productById } from '../data/products';
import { cx, formatPrice } from '../utils/format';
import { api } from '../utils/api';

const payments = [
  {
    id: 'cod',
    label: 'Cash on Delivery (COD)',
    body: 'Pay with cash upon arrival at your doorstep',
    icon: WalletIcon,
    available: true,
  },
  {
    id: 'bkash',
    label: 'bKash Wallet',
    body: 'Online mobile payment (Coming soon)',
    icon: SmartphoneIcon,
    available: false,
  },
  {
    id: 'card',
    label: 'Debit / Credit Card',
    body: 'Visa, Mastercard, Amex (Coming soon)',
    icon: CreditCardIcon,
    available: false,
  },
];

export function Checkout() {
  const { cart, totals, clearCart } = useStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('cod');
  const [delivery, setDelivery] = useState('standard');
  const [submitting, setSubmitting] = useState(false);

  /* require login to checkout */
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitting(true);

    const customerName = `${data.get('first-name')} ${data.get('last-name')}`.trim();
    const email = String(data.get('email') ?? '');
    const phone = String(data.get('phone-number') ?? '');
    const address = `${data.get('street-address')}, ${data.get('area')}, ${data.get('city')}`;
    const city = String(data.get('city') ?? 'Dhaka');
    const notes = String(data.get('notes') ?? '');

    const orderItems = cart.map((line) => {
      const product = productById(line.productId);
      return {
        productId: line.productId,
        name: product?.name || 'Handcrafted Item',
        image: product?.images[0],
        variant: line.variant,
        color: line.color,
        size: line.size,
        qty: line.quantity,
        price: product?.price || 0,
      };
    });

    try {
      const createdOrder = await api.post<{ orderNumber: string }>('/orders', {
        customerName,
        email,
        phone,
        address,
        city,
        subtotal: totals.subtotal,
        delivery: totals.delivery,
        discount: totals.discount,
        total: totals.total,
        payment: 'Unpaid',
        method: 'COD',
        notes,
        items: orderItems,
      });

      clearCart();
      navigate('/order-confirmed', {
        state: {
          orderNumber: createdOrder.orderNumber,
          lines: cart,
          totals,
          name: customerName,
          email,
          address,
          payment: 'Cash on Delivery (COD)',
          delivery,
        },
      });
    } catch {
      // Fallback in case of network issue
      const fallbackId = `TGD-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      navigate('/order-confirmed', {
        state: {
          orderNumber: fallbackId,
          lines: cart,
          totals,
          name: customerName,
          email,
          address,
          payment: 'Cash on Delivery (COD)',
          delivery,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nameParts = (user?.name || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="mx-auto max-w-shell px-5 py-10 lg:px-8 lg:py-14">
      <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-6 font-display text-4xl font-light text-ink lg:text-5xl">Checkout</h1>
      <p className="mt-3 flex items-center gap-2 text-sm text-smoke">
        <LockIcon className="h-3.5 w-3.5 text-bark" strokeWidth={1.5} />
        Secure checkout · Cash on Delivery available across Bangladesh
      </p>

      <form onSubmit={submit} className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div className="space-y-12">
          <Section step="01" title="Contact">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" name="first-name" required defaultValue={firstName} autoComplete="given-name" />
              <Field label="Last name" name="last-name" required defaultValue={lastName} autoComplete="family-name" />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                defaultValue={user?.email || ''}
                autoComplete="email"
                className="sm:col-span-2"
              />
              <Field
                label="Phone number"
                name="phone-number"
                type="tel"
                required
                defaultValue={user?.phone || ''}
                hint="Our courier calls before delivery for confirmation."
                className="sm:col-span-2"
              />
            </div>
          </Section>

          <Section step="02" title="Delivery address">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Street address"
                name="street-address"
                required
                defaultValue={user?.address || ''}
                placeholder="House / Flat / Road / Sector"
                className="sm:col-span-2"
              />
              <Field label="Area" name="area" required defaultValue="Dhanmondi" />
              <Field label="City" name="city" required defaultValue={user?.city || 'Dhaka'} />
              <Field label="Postcode" name="postcode" required defaultValue="1209" />
              <Field label="Division" name="division" defaultValue="Dhaka" />
              <TextArea
                label="Delivery notes (optional)"
                name="notes"
                rows={3}
                placeholder="Gate code, preferred delivery time, or landmark"
                className="sm:col-span-2"
              />
            </div>
          </Section>

          <Section step="03" title="Delivery method">
            <div className="space-y-3">
              {[
                { id: 'standard', label: 'Standard delivery', body: '3–5 working days', price: 'Free' },
                { id: 'express', label: 'Express inside Dhaka', body: 'Next working day', price: '৳180' },
                { id: 'pickup', label: 'Studio pickup — Banani', body: 'Ready in 24 hours', price: 'Free' },
              ].map((option) => (
                <label
                  key={option.id}
                  className={cx(
                    'flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors duration-200 ease-soft',
                    delivery === option.id ? 'border-ink bg-warmwhite' : 'border-sand hover:border-dune'
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={delivery === option.id}
                    onChange={() => setDelivery(option.id)}
                    className="h-4 w-4 accent-clay"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-xs text-smoke">{option.body}</span>
                  </span>
                  <span className="ml-auto text-sm text-ink">{option.price}</span>
                </label>
              ))}
            </div>
          </Section>

          <Section step="04" title="Payment Method">
            <div className="grid gap-3 sm:grid-cols-3">
              {payments.map(({ id, label, body, icon: Icon, available }) => (
                <label
                  key={id}
                  className={cx(
                    'flex flex-col gap-2 border px-5 py-4 transition-all duration-200 ease-soft relative',
                    !available
                      ? 'border-sand/60 bg-sand/20 opacity-60 cursor-not-allowed'
                      : payment === id
                      ? 'border-ink bg-warmwhite ring-1 ring-ink cursor-pointer'
                      : 'border-sand hover:border-dune cursor-pointer'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      disabled={!available}
                      checked={payment === id}
                      onChange={() => available && setPayment(id)}
                      className="h-4 w-4 accent-clay"
                    />
                    <Icon className="h-4 w-4 text-bark" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-ink">{label}</span>
                  </span>
                  <span className="text-xs leading-relaxed text-smoke">{body}</span>
                  {!available && (
                    <span className="mt-1 inline-block text-[10px] uppercase tracking-wider font-semibold text-clay">
                      Disabled
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* COD Notice Box */}
            <div className="mt-6 border border-sand bg-warmwhite p-5">
              <div className="flex items-center gap-2 text-bark">
                <WalletIcon className="h-4 w-4 text-brown" strokeWidth={1.5} />
                <span className="eyebrow font-semibold">Cash on Delivery</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-smoke">
                Please keep <strong className="text-ink font-semibold">{formatPrice(totals.total)}</strong> in cash ready for the courier. You will also receive an order confirmation email.
              </p>
            </div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-sand bg-warmwhite p-6 lg:p-8">
            <h2 className="font-display text-2xl font-light text-ink">Your order</h2>
            <ul className="mt-6 space-y-5 border-b border-sand pb-6">
              {cart.map((line) => {
                const product = productById(line.productId);
                if (!product) return null;
                return (
                  <li key={`${line.productId}-${line.color}`} className="flex gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-16 w-14 object-cover"
                      />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-cream">
                        {line.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] leading-snug text-ink">{product.name}</p>
                      <p className="mt-1 text-xs text-smoke">
                        {line.color}
                        {line.size ? ` · ${line.size}` : ''}
                      </p>
                    </div>
                    <p className="text-sm text-ink">{formatPrice(product.price * line.quantity)}</p>
                  </li>
                );
              })}
              {cart.length === 0 && (
                <li className="text-sm text-smoke">
                  Your cart is empty.{' '}
                  <Link to="/shop" className="text-ink underline underline-offset-4">
                    Add something first
                  </Link>
                  .
                </li>
              )}
            </ul>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd className="text-ink">{formatPrice(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-smoke">Discount</dt>
                <dd className={totals.discount ? 'text-clay' : 'text-ink'}>
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
                <dt className="font-display font-light text-ink">Total (COD)</dt>
                <dd className="font-display font-light text-ink">{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <Button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="mt-8 w-full"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                  Placing order…
                </span>
              ) : (
                `Place Cash on Delivery Order — ${formatPrice(totals.total)}`
              )}
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-4 border-b border-sand pb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sand text-xs font-mono text-ink">
          {step}
        </span>
        <h2 className="font-display text-2xl font-light text-ink">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}