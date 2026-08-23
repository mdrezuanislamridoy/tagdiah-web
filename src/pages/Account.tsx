import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MapPinIcon, PackageIcon, UserIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { orders, customer } from '../data/orders';
import { productById } from '../data/products';
import { cx, formatPrice } from '../utils/format';

const statusStyles: Record<string, string> = {
  Delivered: 'bg-linen text-bark',
  'In transit': 'bg-ink text-cream',
  Processing: 'bg-sand text-ink',
  Cancelled: 'bg-clay/15 text-clay'
};

const tabs = ['Orders', 'Details', 'Addresses'] as const;

export function Account() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Orders');

  return (
    <>
      <PageHeader
        eyebrow={`Customer since ${customer.since}`}
        title={`Hello, ${customer.name.split(' ')[0]}`}
        intro="Track deliveries, revisit past orders and keep your details up to date."
        crumbs={[{ label: 'My account' }]}>
        
        <div className="flex gap-3">
          <Link
            to="/wishlist"
            className="flex items-center gap-2 border border-ink/25 px-5 py-3 text-[11px] uppercase tracking-widest text-ink transition-colors duration-200 ease-soft hover:border-ink hover:bg-ink hover:text-cream">
            
            <HeartIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
            Wishlist
          </Link>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="Account sections" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex gap-2 border-b border-sand lg:flex-col lg:gap-0 lg:border-b-0">
              {tabs.map((item) =>
              <li key={item}>
                  <button
                  type="button"
                  onClick={() => setTab(item)}
                  aria-current={tab === item}
                  className={cx(
                    'w-full border-b-2 px-1 py-3 text-left text-sm transition-colors duration-200 ease-soft lg:border-b lg:border-sand lg:px-0',
                    tab === item ?
                    'border-ink text-ink' :
                    'border-transparent text-smoke hover:text-ink lg:border-sand'
                  )}>
                  
                    {item}
                  </button>
                </li>
              )}
            </ul>
          </nav>

          <div>
            {tab === 'Orders' &&
            <ul className="space-y-5">
                {orders.map((order) =>
              <li key={order.id} className="border border-sand bg-warmwhite">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-sand px-6 py-4">
                      <div>
                        <p className="eyebrow text-bark">Order</p>
                        <p className="mt-1 text-sm text-ink">{order.id}</p>
                      </div>
                      <div>
                        <p className="eyebrow text-bark">Placed</p>
                        <p className="mt-1 text-sm text-ink">{order.date}</p>
                      </div>
                      <div>
                        <p className="eyebrow text-bark">Total</p>
                        <p className="mt-1 text-sm text-ink">{formatPrice(order.totals.total)}</p>
                      </div>
                      <span
                    className={cx(
                      'ml-auto px-3 py-1 text-[10px] uppercase tracking-widest',
                      statusStyles[order.status]
                    )}>
                    
                        {order.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 px-6 py-5">
                      <ul className="flex gap-3">
                        {order.items.map((item) => {
                      const product = productById(item.productId);
                      if (!product) return null;
                      return (
                        <li key={item.productId}>
                              <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-16 w-14 object-cover" />
                          
                            </li>);

                    })}
                      </ul>
                      <p className="text-sm text-smoke">
                        {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'} ·{' '}
                        {order.courier}
                      </p>
                      <div className="ml-auto flex gap-3">
                        <Link
                      to={`/orders/${order.id}`}
                      className="border border-ink/25 px-5 py-2.5 text-[11px] uppercase tracking-widest text-ink transition-colors duration-200 ease-soft hover:border-ink hover:bg-ink hover:text-cream">
                      
                          View details
                        </Link>
                      </div>
                    </div>
                  </li>
              )}
              </ul>
            }

            {tab === 'Details' &&
            <div className="max-w-lg border border-sand bg-warmwhite p-8">
                <div className="flex items-center gap-3 text-bark">
                  <UserIcon className="h-4 w-4" strokeWidth={1.5} />
                  <span className="eyebrow">Personal details</span>
                </div>
                <dl className="mt-7 space-y-5 text-sm">
                  {[
                { label: 'Name', value: customer.name },
                { label: 'Email', value: customer.email },
                { label: 'Phone', value: customer.phone },
                { label: 'Member since', value: customer.since }].
                map((row) =>
                <div key={row.label} className="flex justify-between border-b border-sand pb-4">
                      <dt className="text-smoke">{row.label}</dt>
                      <dd className="text-ink">{row.value}</dd>
                    </div>
                )}
                </dl>
                <Button variant="secondary" className="mt-8">
                  Edit details
                </Button>
              </div>
            }

            {tab === 'Addresses' &&
            <div className="grid gap-5 sm:grid-cols-2">
                <div className="border border-ink bg-warmwhite p-7">
                  <div className="flex items-center gap-2 text-bark">
                    <MapPinIcon className="h-4 w-4" strokeWidth={1.5} />
                    <span className="eyebrow">Default — Home</span>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-ink">{customer.address}</p>
                  <p className="mt-3 text-sm text-smoke">{customer.phone}</p>
                  <div className="mt-7 flex gap-4 text-[11px] uppercase tracking-widest">
                    <button type="button" className="text-ink underline underline-offset-4 hover:text-clay">
                      Edit
                    </button>
                    <button type="button" className="text-smoke underline underline-offset-4 hover:text-clay">
                      Remove
                    </button>
                  </div>
                </div>
                <button
                type="button"
                className="flex flex-col items-center justify-center gap-3 border border-dashed border-dune p-7 text-smoke transition-colors duration-200 ease-soft hover:border-ink hover:text-ink">
                
                  <PackageIcon className="h-5 w-5" strokeWidth={1.5} />
                  <span className="text-[11px] uppercase tracking-widest">Add a new address</span>
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </>);

}