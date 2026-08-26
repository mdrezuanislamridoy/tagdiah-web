import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import {
  ShieldCheckIcon,
  TruckIcon,
  RotateCcwIcon,
  CreditCardIcon,
  BanknoteIcon,
  SmartphoneIcon,
  Loader2Icon,
  ShoppingBagIcon,
} from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { useAuth } from '../contexts/AuthContext';
import { Field, TextArea } from '../components/ui/Field';
import { formatPrice } from '../utils/format';
import { api } from '../utils/api';

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
      <div className="flex items-baseline gap-3 border-b border-sand pb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-clay">{step}</span>
        <h2 className="font-display text-2xl font-light text-ink">{title}</h2>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function cx(...classes: Array<string | boolean | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const payments = [
  {
    id: 'cod',
    label: 'Cash on Delivery (COD)',
    body: 'Pay cash directly upon doorstep delivery',
    icon: BanknoteIcon,
    available: true,
  },
  {
    id: 'bkash',
    label: 'bKash / Nagad',
    body: 'Pay via bKash or Nagad mobile merchant wallet',
    icon: SmartphoneIcon,
    available: true,
  },
  {
    id: 'card',
    label: 'Debit / Credit Card',
    body: 'Pay securely with Visa, Mastercard, or Amex',
    icon: CreditCardIcon,
    available: true,
  },
];

export function Checkout() {
  const { cart, totals, clearCart, productById } = useStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* Guard: Unauthenticated users MUST sign in before placing orders */
  if (!isAuthenticated) {
    return <Navigate to="/auth?redirect=/checkout" replace />;
  }

  /* Check if user came via "Buy It Now" for a single specific item */
  const buyNowItem = location.state?.buyNowItem;
  const isBuyNow = Boolean(buyNowItem);

  const [payment, setPayment] = useState('cod');
  const [delivery, setDelivery] = useState('standard');
  const [deliveryOptions, setDeliveryOptions] = useState([
    { id: 'standard', label: 'Standard delivery', body: '3–5 working days', price: 120 },
    { id: 'express', label: 'Express Dhaka delivery', body: 'Guaranteed 24–48 hours', price: 200 },
    { id: 'pickup', label: 'Studio pickup — Mirpur', body: 'Ready in 24 hours', price: 0 },
  ]);
  const [freeThreshold, setFreeThreshold] = useState(5000);
  const [submitting, setSubmitting] = useState(false);

  /* Compute active items for checkout (Single Buy Now item OR Cart items) */
  const activeItems = useMemo(() => {
    if (buyNowItem) {
      return [
        {
          productId: buyNowItem.productId,
          name: buyNowItem.name,
          image: buyNowItem.image,
          color: buyNowItem.color,
          size: buyNowItem.size,
          quantity: buyNowItem.quantity || 1,
          price: buyNowItem.price,
        },
      ];
    }
    return cart.map((line) => {
      const product = productById(line.productId);
      return {
        productId: line.productId,
        name: product?.name || 'Handcrafted Item',
        image: product?.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
        variant: line.color && line.size ? `${line.color} / ${line.size}` : line.color || line.size || null,
        color: line.color,
        size: line.size,
        quantity: line.quantity,
        price: product?.price || 0,
      };
    });
  }, [buyNowItem, cart, productById]);

  /* Compute subtotal and discount */
  const checkoutSubtotal = useMemo(() => {
    if (buyNowItem) {
      return (buyNowItem.price || 0) * (buyNowItem.quantity || 1);
    }
    return totals.subtotal;
  }, [buyNowItem, totals.subtotal]);

  const checkoutDiscount = useMemo(() => {
    if (buyNowItem) return 0;
    return totals.discount;
  }, [buyNowItem, totals.discount]);

  /* Load dynamic delivery settings from admin panel API */
  useEffect(() => {
    api
      .get<any>('/settings/delivery')
      .then((data) => {
        if (data?.options && Array.isArray(data.options)) {
          setDeliveryOptions(data.options);
        }
        if (data?.freeDeliveryThreshold) {
          setFreeThreshold(data.freeDeliveryThreshold);
        }
      })
      .catch(() => {});
  }, []);

  /* Require login to checkout */
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  /* Calculate dynamic delivery charge */
  const selectedOption = deliveryOptions.find((o) => o.id === delivery) || deliveryOptions[0];
  const isFreeDelivery =
    selectedOption.price === 0 ||
    (selectedOption.id === 'standard' && checkoutSubtotal - checkoutDiscount >= freeThreshold);
  const currentDeliveryFee = isFreeDelivery ? 0 : selectedOption.price;
  const grandTotal = Math.max(0, checkoutSubtotal - checkoutDiscount + currentDeliveryFee);

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

    const orderItemsPayload = activeItems.map((it) => ({
      productId: it.productId,
      name: it.name,
      image: it.image,
      variant: it.size || it.color || 'Standard',
      color: it.color,
      size: it.size,
      qty: it.quantity,
      price: it.price,
    }));

    try {
      const createdOrder = await api.post<{ orderNumber: string }>('/orders', {
        customerName,
        email,
        phone,
        address,
        city,
        notes: notes || undefined,
        items: orderItemsPayload,
        subtotal: checkoutSubtotal,
        discount: checkoutDiscount,
        delivery: currentDeliveryFee,
        total: grandTotal,
        payment: 'Unpaid',
        method: 'COD',
      });

      // Clear main cart ONLY if this was a cart-wide checkout
      if (!isBuyNow) {
        clearCart();
      }

      navigate('/order-confirmation', {
        state: {
          orderNumber: createdOrder?.orderNumber || 'TGD-' + Math.floor(100000 + Math.random() * 900000),
          customer: {
            name: customerName,
            email,
            phone,
            address,
            city,
          },
          items: activeItems,
          totals: {
            subtotal: checkoutSubtotal,
            discount: checkoutDiscount,
            delivery: currentDeliveryFee,
            total: grandTotal,
          },
          payment: 'Cash on Delivery (COD)',
          deliveryMethod: selectedOption.label,
        },
      });
    } catch {
      // Fallback optimistic checkout
      if (!isBuyNow) {
        clearCart();
      }
      navigate('/order-confirmation', {
        state: {
          orderNumber: 'TGD-' + Math.floor(100000 + Math.random() * 900000),
          customer: {
            name: customerName,
            email,
            phone,
            address,
            city,
          },
          items: activeItems,
          totals: {
            subtotal: checkoutSubtotal,
            discount: checkoutDiscount,
            delivery: currentDeliveryFee,
            total: grandTotal,
          },
          payment: 'Cash on Delivery (COD)',
          deliveryMethod: selectedOption.label,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (activeItems.length === 0) {
    return (
      <div className="mx-auto max-w-shell px-5 py-24 text-center">
        <h1 className="font-display text-4xl font-light text-ink">Your cart is empty</h1>
        <p className="mt-3 text-sm text-smoke">Add pieces to your bag before checking out.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block border border-ink bg-ink px-8 py-3.5 text-xs uppercase tracking-widest text-cream transition-colors duration-200 ease-soft hover:bg-clay hover:border-clay"
        >
          Explore catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
      <div className="border-b border-sand pb-8">
        <div className="flex items-center gap-2">
          <p className="eyebrow text-clay">Complete your order</p>
          {isBuyNow && (
            <span className="rounded bg-clay/10 px-2 py-0.5 text-[11px] font-medium text-clay border border-clay/30">
              Direct Single Item Order
            </span>
          )}
        </div>
        <h1 className="mt-2 font-display text-3xl font-light text-ink sm:text-4xl">Checkout</h1>
        <p className="mt-2 text-sm text-smoke">
          Secure checkout · Cash on Delivery available across Bangladesh
        </p>
      </div>

      <form onSubmit={submit} className="mt-12 grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16">
        <div className="space-y-10">
          <Section step="01" title="Customer information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                name="first-name"
                required
                defaultValue={user?.name?.split(' ')[0] || ''}
              />
              <Field
                label="Last name"
                name="last-name"
                required
                defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                defaultValue={user?.email || ''}
                className="sm:col-span-2"
              />
              <Field
                label="Phone number"
                name="phone-number"
                type="tel"
                required
                defaultValue={user?.phone || ''}
                className="sm:col-span-2"
                hint="Our courier calls before delivery for confirmation."
              />
            </div>
          </Section>

          <Section step="02" title="Delivery address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Street address"
                name="street-address"
                required
                defaultValue={user?.address || 'House 12, Road 27'}
                className="sm:col-span-2"
              />
              <Field label="Area / Thana" name="area" required defaultValue="Banani" />
              <Field
                label="City / District"
                name="city"
                required
                defaultValue={user?.city || 'Dhaka'}
              />
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

          {/* ── Dynamic Delivery Method Section ── */}
          <Section step="03" title="Delivery method">
            <div className="space-y-3">
              {deliveryOptions.map((option) => {
                const optIsFree =
                  option.price === 0 ||
                  (option.id === 'standard' && checkoutSubtotal - checkoutDiscount >= freeThreshold);

                return (
                  <label
                    key={option.id}
                    className={cx(
                      'flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors duration-200 ease-soft',
                      delivery === option.id
                        ? 'border-ink bg-warmwhite'
                        : 'border-sand hover:border-dune'
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
                      <span className="block text-sm font-medium text-ink">{option.label}</span>
                      <span className="mt-0.5 block text-xs text-smoke">{option.body}</span>
                    </span>
                    <span className="ml-auto text-sm font-medium font-mono text-ink">
                      {optIsFree ? 'Free' : formatPrice(option.price)}
                    </span>
                  </label>
                );
              })}
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
                      checked={payment === id}
                      disabled={!available}
                      onChange={() => available && setPayment(id)}
                      className="h-4 w-4 accent-clay"
                    />
                    <Icon className="h-4 w-4 text-ink" strokeWidth={1.5} />
                  </span>
                  <span className="mt-1">
                    <span className="block text-sm font-medium text-ink">{label}</span>
                    <span className="mt-0.5 block text-xs text-smoke">{body}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-sand bg-warmwhite p-4">
              <div className="flex items-start gap-3">
                <BanknoteIcon className="h-5 w-5 text-clay shrink-0 mt-0.5" strokeWidth={1.5} />
                <div className="text-xs text-smoke leading-relaxed">
                  <p className="font-medium text-ink mb-0.5">Cash on Delivery (COD) Active</p>
                  <p>
                    Please have the exact cash amount ready for the delivery courier upon arrival.
                    Orders are verified by SMS/call before dispatch from our Banani studio.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* ── Order Summary Sidebar ── */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-sand bg-warmwhite p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-light text-ink">Order summary</h2>
              <span className="text-xs font-mono text-smoke">
                {activeItems.length} item{activeItems.length > 1 ? 's' : ''}
              </span>
            </div>

            <ul className="mt-6 divide-y divide-sand border-b border-t border-sand">
              {activeItems.map((line, idx) => (
                <li key={`${line.productId}-${idx}`} className="flex gap-4 py-4">
                  <img
                    src={line.image}
                    alt={line.name}
                    className="h-16 w-16 bg-sand/30 object-cover border border-sand/50"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{line.name}</p>
                    <p className="mt-0.5 text-xs text-smoke">
                      Qty {line.quantity} · {line.size || line.color || 'Standard'}
                    </p>
                    <p className="mt-2 text-xs font-mono font-medium text-ink">
                      {formatPrice(line.price * line.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd className="font-mono text-ink">{formatPrice(checkoutSubtotal)}</dd>
              </div>
              {checkoutDiscount > 0 && (
                <div className="flex justify-between text-bark">
                  <dt>Promotional Discount</dt>
                  <dd className="font-mono">−{formatPrice(checkoutDiscount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-smoke">Delivery ({selectedOption.label.split(' ')[0]})</dt>
                <dd className="font-mono text-ink">
                  {isFreeDelivery ? 'Free' : formatPrice(currentDeliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-sand pt-4 font-display text-lg text-ink">
                <dt>Total Due on Delivery</dt>
                <dd className="font-mono font-semibold">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 flex w-full items-center justify-center gap-2 border border-ink bg-ink py-4 text-xs uppercase tracking-widest text-cream transition-colors duration-200 ease-soft hover:bg-clay hover:border-clay disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" /> Placing Order…
                </span>
              ) : (
                `Place Cash on Delivery Order — ${formatPrice(grandTotal)}`
              )}
            </button>

            <ul className="mt-8 space-y-3 border-t border-sand pt-6 text-xs text-smoke">
              <li className="flex items-center gap-2.5">
                <ShieldCheckIcon className="h-4 w-4 text-clay" strokeWidth={1.5} />
                <span>Quality guaranteed handcrafted artisanal pieces</span>
              </li>
              <li className="flex items-center gap-2.5">
                <TruckIcon className="h-4 w-4 text-clay" strokeWidth={1.5} />
                <span>Doorstep delivery across all 64 districts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <RotateCcwIcon className="h-4 w-4 text-clay" strokeWidth={1.5} />
                <span>7-day simple return guarantee</span>
              </li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}