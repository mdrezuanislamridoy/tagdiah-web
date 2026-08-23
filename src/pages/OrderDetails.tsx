import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckIcon, PackageXIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { orderById } from '../data/orders';
import { productById } from '../data/products';
import { cx, formatPrice } from '../utils/format';

const timeline = ['Order placed', 'Packed by the studio', 'Handed to courier', 'Out for delivery', 'Delivered'];

const stageForStatus: Record<string, number> = {
  Processing: 1,
  'In transit': 2,
  Delivered: 4,
  Cancelled: 0
};

export function OrderDetails() {
  const { id } = useParams();
  const order = id ? orderById(id) : undefined;

  if (!order) {
    return (
      <div className="mx-auto max-w-shell px-5 py-24 lg:px-8">
        <EmptyState
          icon={<PackageXIcon className="h-6 w-6" strokeWidth={1.5} />}
          title="We can’t find that order"
          body="Check the order number in your confirmation email, or view all your orders."
          actionLabel="My orders"
          actionTo="/account" />
        
      </div>);

  }

  const stage = stageForStatus[order.status] ?? 0;

  return (
    <>
      <PageHeader
        eyebrow={`Placed ${order.date}`}
        title={`Order ${order.id}`}
        crumbs={[{ label: 'My account', to: '/account' }, { label: order.id }]}>
        
        <span className="inline-block bg-ink px-4 py-2 text-[10px] uppercase tracking-widest text-cream">
          {order.status}
        </span>
      </PageHeader>

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        {order.status !== 'Cancelled' &&
        <ol className="mb-14 grid gap-6 border-b border-sand pb-12 sm:grid-cols-5">
            {timeline.map((label, index) => {
            const done = index <= stage;
            return (
              <li key={label} className="flex gap-3 sm:flex-col sm:gap-3">
                  <span
                  className={cx(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px]',
                    done ? 'border-ink bg-ink text-cream' : 'border-dune text-dune'
                  )}>
                  
                    {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={2} /> : index + 1}
                  </span>
                  <span className={cx('text-sm', done ? 'text-ink' : 'text-smoke')}>{label}</span>
                </li>);

          })}
          </ol>
        }

        <div className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          <div>
            <h2 className="font-display text-2xl font-light text-ink">Items</h2>
            <ul className="mt-6 divide-y divide-sand border-y border-sand">
              {order.items.map((item) => {
                const product = productById(item.productId);
                if (!product) return null;
                return (
                  <li key={item.productId} className="flex items-center gap-5 py-6">
                    <Link to={`/product/${product.slug}`} className="h-24 w-20 shrink-0 bg-linen">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover" />
                      
                    </Link>
                    <div className="min-w-0">
                      <p className="font-display text-lg font-light text-ink">{product.name}</p>
                      <p className="mt-1 text-xs text-smoke">
                        {item.color} · Qty {item.quantity}
                      </p>
                      <Link
                        to={`/product/${product.slug}`}
                        className="mt-3 inline-block text-[11px] uppercase tracking-widest text-ink underline underline-offset-4 hover:text-clay">
                        
                        Buy again
                      </Link>
                    </div>
                    <p className="ml-auto text-sm text-ink">
                      {formatPrice(product.price * item.quantity)}
                    </p>
                  </li>);

              })}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="secondary">Download invoice</Button>
              {order.status === 'Delivered' && <Button variant="secondary">Request a return</Button>}
              <Button variant="quiet">Need help with this order?</Button>
            </div>
          </div>

          <aside className="space-y-6">
            <Panel title="Delivery address" body={order.address} />
            <Panel title="Payment" body={order.payment} />
            <Panel title="Courier" body={`${order.courier} · ${order.tracking}`} />
            <div className="border border-sand bg-warmwhite p-6">
              <p className="eyebrow text-bark">Summary</p>
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
                <div className="flex justify-between border-t border-sand pt-3">
                  <dt className="uppercase tracking-widest text-ink">Total</dt>
                  <dd className="text-ink">{formatPrice(order.totals.total)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </>);

}

function Panel({ title, body }: {title: string;body: string;}) {
  return (
    <div className="border border-sand bg-warmwhite p-6">
      <p className="eyebrow text-bark">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink">{body}</p>
    </div>);

}