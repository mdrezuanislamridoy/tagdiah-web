import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckIcon, PackageXIcon, TruckIcon, WalletIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { orderById } from '../data/orders';
import { productById } from '../data/products';
import { cx, formatPrice } from '../utils/format';
import { api } from '../utils/api';
import type { Order } from '../types';

const timeline = ['Order placed', 'Packed by the studio', 'Handed to courier', 'Out for delivery', 'Delivered'];

const stageForStatus: Record<string, number> = {
  Pending: 0,
  Confirmed: 1,
  Processing: 1,
  'In transit': 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 0,
};

interface BackendOrderItem {
  id: string;
  productId?: string;
  name: string;
  image?: string;
  variant?: string;
  color?: string;
  size?: string;
  qty: number;
  price: number;
}

interface BackendOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  payment: string;
  method: string;
  status: string;
  courier?: string;
  tracking?: string;
  notes?: string;
  createdAt: string;
  items: BackendOrderItem[];
}

export function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Try fetching from backend API first
    api
      .get<BackendOrder>(`/orders/${id}`)
      .then((data) => {
        if (data) {
          const mappedOrder: Order = {
            id: data.orderNumber || data.id,
            date: new Date(data.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            status: data.status as Order['status'],
            items: data.items.map((item) => ({
              productId: item.productId || 'p-01',
              quantity: item.qty,
              color: item.color || item.variant || 'Standard',
            })),
            totals: {
              subtotal: data.subtotal,
              discount: data.discount,
              delivery: data.delivery,
              total: data.total,
            },
            address: `${data.address}, ${data.city}`,
            payment: data.method === 'COD' ? 'Cash on Delivery (COD)' : data.payment,
            courier: data.courier || 'Pathao Courier',
            tracking: data.tracking || 'PT-Pending',
          };
          setOrder(mappedOrder);
        }
      })
      .catch(() => {
        // Fallback to static mock orders
        const local = orderById(id);
        if (local) setOrder(local);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-shell px-5 py-24 text-center lg:px-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent" />
        <p className="mt-4 text-xs uppercase tracking-widest text-smoke">Loading order details…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-shell px-5 py-24 lg:px-8">
        <EmptyState
          icon={<PackageXIcon className="h-6 w-6" strokeWidth={1.5} />}
          title="We can’t find that order"
          body="Check the order number in your confirmation email, or view all your orders in your dashboard."
          actionLabel="My Dashboard"
          actionTo="/account"
        />
      </div>
    );
  }

  const stage = stageForStatus[order.status] ?? 0;

  return (
    <>
      <PageHeader
        eyebrow={`Placed on ${order.date}`}
        title={`Order #${order.id}`}
        crumbs={[{ label: 'My Dashboard', to: '/account' }, { label: order.id }]}
      >
        <div className="flex items-center gap-3">
          <span className="inline-block bg-ink px-4 py-2 text-[10px] uppercase tracking-widest text-cream font-medium">
            {order.status}
          </span>
          <span className="inline-block border border-sand bg-warmwhite px-3.5 py-2 text-[10px] uppercase tracking-widest text-ink">
            Cash on Delivery
          </span>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        {/* Tracking Timeline */}
        {order.status !== 'Cancelled' && (
          <ol className="mb-14 grid gap-6 border-b border-sand pb-12 sm:grid-cols-5">
            {timeline.map((label, index) => {
              const done = index <= stage;
              return (
                <li key={label} className="flex gap-3 sm:flex-col sm:gap-3">
                  <span
                    className={cx(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium',
                      done ? 'border-ink bg-ink text-cream' : 'border-dune text-dune'
                    )}
                  >
                    {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={2} /> : index + 1}
                  </span>
                  <span className={cx('text-sm', done ? 'text-ink font-medium' : 'text-smoke')}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-light text-ink">Items Ordered</h2>
            <ul className="mt-6 divide-y divide-sand border-y border-sand">
              {order.items.map((item, idx) => {
                const product = productById(item.productId);
                return (
                  <li key={`${item.productId}-${idx}`} className="flex items-center gap-5 py-6">
                    <div className="h-24 w-20 shrink-0 bg-linen border border-sand">
                      <img
                        src={product?.images[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400'}
                        alt={product?.name || 'Tagdiah Item'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-lg font-light text-ink">
                        {product?.name || 'Handcrafted Artisan Decor'}
                      </p>
                      <p className="mt-1 text-xs text-smoke">
                        {item.color} · Qty {item.quantity}
                      </p>
                      {product && (
                        <Link
                          to={`/product/${product.slug}`}
                          className="mt-3 inline-block text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 hover:text-clay"
                        >
                          Buy again
                        </Link>
                      )}
                    </div>
                    <p className="ml-auto text-sm font-medium text-ink">
                      {formatPrice((product?.price || 4500) * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={() => window.print()}>
                Download Invoice
              </Button>
              <Link to="/account">
                <Button variant="quiet">Back to Dashboard</Button>
              </Link>
            </div>
          </div>

          <aside className="space-y-6">
            <Panel title="Delivery Address" body={order.address} />
            <Panel
              title="Payment"
              body={`${order.payment} — Pay exact amount to courier upon parcel inspection.`}
            />
            <Panel title="Courier & Tracking" body={`${order.courier} · ${order.tracking}`} />

            <div className="border border-sand bg-warmwhite p-6">
              <p className="eyebrow text-bark">Order Summary</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-smoke">Subtotal</dt>
                  <dd className="text-ink">{formatPrice(order.totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-smoke">Discount</dt>
                  <dd className="text-clay">
                    {order.totals.discount ? `− ${formatPrice(order.totals.discount)}` : '—'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-smoke">Delivery</dt>
                  <dd className="text-ink">
                    {order.totals.delivery === 0 ? 'Free' : formatPrice(order.totals.delivery)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-sand pt-3 font-medium">
                  <dt className="uppercase tracking-widest text-ink">Total Due (COD)</dt>
                  <dd className="text-ink">{formatPrice(order.totals.total)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-sand bg-warmwhite p-6">
      <p className="eyebrow text-bark">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink">{body}</p>
    </div>
  );
}