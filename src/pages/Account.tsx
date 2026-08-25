import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { HeartIcon, MapPinIcon, PackageIcon, UserIcon, LogOutIcon, CheckIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { orders } from '../data/orders';
import { productById } from '../data/products';
import { cx, formatPrice } from '../utils/format';
import { useAuth } from '../contexts/AuthContext';

const statusStyles: Record<string, string> = {
  Delivered: 'bg-linen text-bark',
  'In transit': 'bg-ink text-cream',
  Processing: 'bg-sand text-ink',
  Cancelled: 'bg-clay/15 text-clay',
};

const tabs = ['Orders', 'Details', 'Addresses'] as const;

export function Account() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [tab, setTab] = useState<(typeof tabs)[number]>('Orders');

  /* Edit state */
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [detailsSaved, setDetailsSaved] = useState(false);

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [editCity, setEditCity] = useState(user?.city || 'Dhaka');
  const [addressSaved, setAddressSaved] = useState(false);

  /* redirect to auth if not logged in */
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name: editName, phone: editPhone });
    setIsEditingDetails(false);
    setDetailsSaved(true);
    setTimeout(() => setDetailsSaved(false), 3000);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ address: editAddress, city: editCity });
    setIsEditingAddress(false);
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  return (
    <>
      <PageHeader
        eyebrow={`Customer since ${user.since || '2026'}`}
        title={`Hello, ${user.name.split(' ')[0]}`}
        intro="Track deliveries, revisit past orders and keep your details up to date."
        crumbs={[{ label: 'My account' }]}
      >
        <div className="flex gap-3">
          <Link
            to="/wishlist"
            className="flex items-center gap-2 border border-ink/25 px-5 py-3 text-[11px] uppercase tracking-widest text-ink transition-colors duration-200 ease-soft hover:border-ink hover:bg-ink hover:text-cream"
          >
            <HeartIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
            Wishlist
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 border border-clay/25 px-5 py-3 text-[11px] uppercase tracking-widest text-clay transition-colors duration-200 ease-soft hover:border-clay hover:bg-clay hover:text-cream"
          >
            <LogOutIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          <nav aria-label="Account sections" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex gap-2 border-b border-sand lg:flex-col lg:gap-0 lg:border-b-0">
              {tabs.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setTab(item)}
                    aria-current={tab === item}
                    className={cx(
                      'w-full border-b-2 px-1 py-3 text-left text-sm transition-colors duration-200 ease-soft lg:border-b lg:border-sand lg:px-0',
                      tab === item
                        ? 'border-ink text-ink font-medium'
                        : 'border-transparent text-smoke hover:text-ink lg:border-sand'
                    )}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            {tab === 'Orders' && (
              <ul className="space-y-5">
                {orders.map((order) => (
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
                        )}
                      >
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
                                className="h-16 w-14 object-cover"
                              />
                            </li>
                          );
                        })}
                      </ul>
                      <p className="text-sm text-smoke">
                        {order.items.length} {order.items.length === 1 ? 'piece' : 'pieces'} ·{' '}
                        {order.courier}
                      </p>
                      <div className="ml-auto flex gap-3">
                        <Link
                          to={`/orders/${order.id}`}
                          className="border border-ink/25 px-5 py-2.5 text-[11px] uppercase tracking-widest text-ink transition-colors duration-200 ease-soft hover:border-ink hover:bg-ink hover:text-cream"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {tab === 'Details' && (
              <div className="max-w-lg border border-sand bg-warmwhite p-8">
                <div className="flex items-center justify-between text-bark">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-4 w-4" strokeWidth={1.5} />
                    <span className="eyebrow">Personal details</span>
                  </div>
                  {detailsSaved && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckIcon className="h-3.5 w-3.5" /> Details saved
                    </span>
                  )}
                </div>

                {isEditingDetails ? (
                  <form onSubmit={handleSaveDetails} className="mt-7 space-y-4">
                    <div>
                      <label className="eyebrow block text-bark mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        className="h-11 w-full border border-sand bg-white px-3.5 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="eyebrow block text-bark mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="h-11 w-full border border-sand bg-sand/30 px-3.5 text-sm text-smoke cursor-not-allowed"
                      />
                      <p className="mt-1 text-[11px] text-smoke">Email address cannot be changed.</p>
                    </div>
                    <div>
                      <label className="eyebrow block text-bark mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="+880 1700 000 000"
                        className="h-11 w-full border border-sand bg-white px-3.5 text-sm text-ink focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        type="submit"
                        className="bg-ink px-6 py-2.5 text-[11px] uppercase tracking-widest text-cream hover:bg-clay transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingDetails(false)}
                        className="border border-sand px-5 py-2.5 text-[11px] uppercase tracking-widest text-smoke hover:text-ink transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <dl className="mt-7 space-y-5 text-sm">
                      {[
                        { label: 'Name', value: user.name },
                        { label: 'Email', value: user.email },
                        { label: 'Phone', value: user.phone || '—' },
                        { label: 'Member since', value: user.since || '2026' },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between border-b border-sand pb-4">
                          <dt className="text-smoke">{row.label}</dt>
                          <dd className="text-ink font-medium">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <Button
                      variant="secondary"
                      className="mt-8"
                      onClick={() => {
                        setEditName(user.name);
                        setEditPhone(user.phone || '');
                        setIsEditingDetails(true);
                      }}
                    >
                      Edit details
                    </Button>
                  </>
                )}
              </div>
            )}

            {tab === 'Addresses' && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="border border-ink bg-warmwhite p-7">
                  <div className="flex items-center justify-between text-bark">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" strokeWidth={1.5} />
                      <span className="eyebrow">Default — Home</span>
                    </div>
                    {addressSaved && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckIcon className="h-3.5 w-3.5" /> Saved
                      </span>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="mt-5 space-y-4">
                      <div>
                        <label className="eyebrow block text-bark mb-1.5">Street Address</label>
                        <input
                          type="text"
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          placeholder="e.g. Flat 4B, House 27, Road 11"
                          required
                          className="h-10 w-full border border-sand bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="eyebrow block text-bark mb-1.5">City</label>
                        <input
                          type="text"
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          placeholder="e.g. Dhaka"
                          required
                          className="h-10 w-full border border-sand bg-white px-3 text-sm text-ink focus:border-ink focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="bg-ink px-4 py-2 text-[10px] uppercase tracking-widest text-cream hover:bg-clay"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="border border-sand px-3 py-2 text-[10px] uppercase tracking-widest text-smoke"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="mt-5 text-sm leading-relaxed text-ink">
                        {user.address ? `${user.address}, ${user.city || 'Dhaka'}` : 'No address saved yet'}
                      </p>
                      <p className="mt-3 text-sm text-smoke">{user.phone || '—'}</p>
                      <div className="mt-7 flex gap-4 text-[11px] uppercase tracking-widest">
                        <button
                          type="button"
                          onClick={() => {
                            setEditAddress(user.address || '');
                            setEditCity(user.city || 'Dhaka');
                            setIsEditingAddress(true);
                          }}
                          className="text-ink underline underline-offset-4 hover:text-clay"
                        >
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {!isEditingAddress && !user.address && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditAddress('');
                      setEditCity('Dhaka');
                      setIsEditingAddress(true);
                    }}
                    className="flex flex-col items-center justify-center gap-3 border border-dashed border-dune p-7 text-smoke transition-colors duration-200 ease-soft hover:border-ink hover:text-ink"
                  >
                    <PackageIcon className="h-5 w-5" strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-widest">Add a new address</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}