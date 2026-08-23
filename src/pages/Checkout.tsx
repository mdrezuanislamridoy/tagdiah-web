import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCardIcon, LockIcon, Loader2Icon, SmartphoneIcon, WalletIcon } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Field, TextArea } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useStore } from '../contexts/StoreContext';
import { productById } from '../data/products';
import { cx, formatPrice } from '../utils/format';

const payments = [
{ id: 'bkash', label: 'bKash', body: 'Pay from your bKash wallet', icon: SmartphoneIcon },
{ id: 'card', label: 'Card', body: 'Visa, Mastercard, Amex', icon: CreditCardIcon },
{ id: 'cod', label: 'Cash on delivery', body: 'Inside Dhaka, under ৳15,000', icon: WalletIcon }];


export function Checkout() {
  const { cart, totals, clearCart } = useStore();
  const navigate = useNavigate();
  const [payment, setPayment] = useState('bkash');
  const [delivery, setDelivery] = useState('standard');
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitting(true);
    const snapshot = {
      lines: cart,
      totals,
      name: `${data.get('first-name')} ${data.get('last-name')}`,
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone-number') ?? ''),
      address: `${data.get('street-address')}, ${data.get('area')}, ${data.get('city')}`,
      payment: payments.find((p) => p.id === payment)?.label ?? 'bKash',
      delivery
    };
    window.setTimeout(() => {
      clearCart();
      navigate('/order-confirmed', { state: snapshot });
    }, 1100);
  };

  return (
    <div className="mx-auto max-w-shell px-5 py-10 lg:px-8 lg:py-14">
      <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-6 font-display text-4xl font-light text-ink lg:text-5xl">Checkout</h1>
      <p className="mt-3 flex items-center gap-2 text-sm text-smoke">
        <LockIcon className="h-3.5 w-3.5 text-bark" strokeWidth={1.5} />
        Encrypted payment. We never store your card details.
      </p>

      <form onSubmit={submit} className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div className="space-y-12">
          <Section step="01" title="Contact">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" name="first-name" required defaultValue="Nusrat" autoComplete="given-name" />
              <Field label="Last name" name="last-name" required defaultValue="Jahan" autoComplete="family-name" />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                defaultValue="nusrat.jahan@example.com"
                autoComplete="email"
                className="sm:col-span-2" />
              
              <Field
                label="Phone number"
                name="phone-number"
                type="tel"
                required
                defaultValue="+880 1712 004 118"
                hint="We call before delivery for large pieces."
                className="sm:col-span-2" />
              
            </div>
          </Section>

          <Section step="02" title="Delivery address">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Street address"
                name="street-address"
                required
                defaultValue="Flat 4B, House 27, Road 11"
                className="sm:col-span-2" />
              
              <Field label="Area" name="area" required defaultValue="Dhanmondi" />
              <Field label="City" name="city" required defaultValue="Dhaka" />
              <Field label="Postcode" name="postcode" required defaultValue="1209" />
              <Field label="Division" name="division" defaultValue="Dhaka" />
              <TextArea
                label="Delivery notes (optional)"
                name="notes"
                rows={3}
                placeholder="Gate code, preferred time, or where to leave the parcel"
                className="sm:col-span-2" />
              
            </div>
          </Section>

          <Section step="03" title="Delivery method">
            <div className="space-y-3">
              {[
              { id: 'standard', label: 'Standard delivery', body: '3–5 working days', price: 'Free' },
              { id: 'express', label: 'Express inside Dhaka', body: 'Next working day', price: '৳180' },
              { id: 'pickup', label: 'Studio pickup — Banani', body: 'Ready in 24 hours', price: 'Free' }].
              map((option) =>
              <label
                key={option.id}
                className={cx(
                  'flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors duration-200 ease-soft',
                  delivery === option.id ? 'border-ink bg-warmwhite' : 'border-sand hover:border-dune'
                )}>
                
                  <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={delivery === option.id}
                  onChange={() => setDelivery(option.id)}
                  className="h-4 w-4 accent-clay" />
                
                  <span className="min-w-0">
                    <span className="block text-sm text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-xs text-smoke">{option.body}</span>
                  </span>
                  <span className="ml-auto text-sm text-ink">{option.price}</span>
                </label>
              )}
            </div>
          </Section>

          <Section step="04" title="Payment">
            <div className="grid gap-3 sm:grid-cols-3">
              {payments.map(({ id, label, body, icon: Icon }) =>
              <label
                key={id}
                className={cx(
                  'flex cursor-pointer flex-col gap-2 border px-5 py-4 transition-colors duration-200 ease-soft',
                  payment === id ? 'border-ink bg-warmwhite' : 'border-sand hover:border-dune'
                )}>
                
                  <span className="flex items-center gap-2">
                    <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={payment === id}
                    onChange={() => setPayment(id)}
                    className="h-4 w-4 accent-clay" />
                  
                    <Icon className="h-4 w-4 text-bark" strokeWidth={1.5} />
                    <span className="text-sm text-ink">{label}</span>
                  </span>
                  <span className="text-xs leading-relaxed text-smoke">{body}</span>
                </label>
              )}
            </div>

            {payment === 'card' &&
            <div className="mt-6 grid gap-5 border border-sand bg-warmwhite p-5 sm:grid-cols-2">
                <Field label="Card number" name="card-number" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                <Field label="Expiry" name="expiry" placeholder="MM / YY" />
                <Field label="CVC" name="cvc" placeholder="123" />
              </div>
            }
            {payment === 'bkash' &&
            <div className="mt-6 border border-sand bg-warmwhite p-5">
                <Field label="bKash number" name="bkash" placeholder="01XXXXXXXXX" />
                <p className="mt-3 text-xs text-smoke">
                  You will receive a payment prompt on this number after placing the order.
                </p>
              </div>
            }
            {payment === 'cod' &&
            <p className="mt-6 border border-sand bg-warmwhite p-5 text-xs leading-relaxed text-smoke">
                Please keep {formatPrice(totals.total)} ready. Our courier carries change but cannot
                accept card payments at the door.
              </p>
            }
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
                        className="h-16 w-14 object-cover" />
                      
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
                  </li>);

              })}
              {cart.length === 0 &&
              <li className="text-sm text-smoke">
                  Your cart is empty.{' '}
                  <Link to="/shop" className="text-ink underline underline-offset-4">
                    Add something first
                  </Link>
                  .
                </li>
              }
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
                  {delivery === 'express' ? '৳180' : totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery)}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex items-baseline justify-between border-t border-sand pt-5">
              <span className="text-sm uppercase tracking-widest text-ink">Total</span>
              <span className="font-display text-3xl font-light text-ink">
                {formatPrice(totals.total + (delivery === 'express' ? 180 : 0))}
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-7 w-full"
              disabled={submitting || cart.length === 0}>
              
              {submitting ?
              <>
                  <Loader2Icon className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                  Placing order
                </> :

              'Place order'
              }
            </Button>
            <p className="mt-4 text-center text-xs leading-relaxed text-smoke">
              By placing this order you agree to our terms and return policy.
            </p>
          </div>
        </aside>
      </form>
    </div>);

}

function Section({
  step,
  title,
  children




}: {step: string;title: string;children: React.ReactNode;}) {
  return (
    <section>
      <div className="flex items-baseline gap-4 border-b border-sand pb-4">
        <span className="font-display text-xl font-light text-clay">{step}</span>
        <h2 className="font-display text-2xl font-light text-ink">{title}</h2>
      </div>
      <div className="mt-7">{children}</div>
    </section>);

}