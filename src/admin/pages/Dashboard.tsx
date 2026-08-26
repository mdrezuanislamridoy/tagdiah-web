import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BanknoteIcon,
  ShoppingBagIcon,
  UsersIcon,
  PackageIcon,
  PackagePlusIcon,
  TicketPercentIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  StarIcon,
  DownloadIcon,
  CalendarDaysIcon,
} from 'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueArea } from '../components/charts/RevenueArea';
import { OrdersBar } from '../components/charts/OrdersBar';
import { Legend, chartColors } from '../components/charts/ChartBits';
import { orders as fallbackOrders } from '../data/orders';
import { products as fallbackProducts } from '../data/products';
import { reviews as fallbackReviews } from '../data/reviews';
import { activity } from '../data/analytics';
import { bdt, shortDate } from '../utils/format';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { exportToCSV } from '../utils/exportHelper';

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  avgOrderValue: number;
  recentOrders: any[];
  topSelling: any[];
  lowStock: any[];
  monthlyRevenue: any[];
}

export function Dashboard() {
  const toast = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    api
      .get<DashboardData>('/orders/dashboard/stats')
      .then((res) => {
        if (res) setData(res);
      })
      .catch(() => {
        // Fallback to local data if needed
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalSales = data?.totalSales ?? 812400;
  const totalOrders = data?.totalOrders ?? fallbackOrders.length;
  const pendingOrders = data?.pendingOrders ?? 4;
  const totalCustomers = data?.totalCustomers ?? 2486;
  const totalProducts = data?.totalProducts ?? fallbackProducts.length;
  const lowStockCount = data?.lowStockCount ?? 3;
  const avgOrderValue = data?.avgOrderValue ?? 2333;

  const recentOrders =
    data?.recentOrders && data.recentOrders.length > 0
      ? data.recentOrders.map((o) => ({
          id: o.orderNumber || o.id,
          customer: o.customerName || o.customer?.name || 'Customer',
          date: o.createdAt?.split('T')[0] || '2026-08-25',
          total: o.total,
          payment: o.payment === 'Paid' ? 'Paid' : 'COD',
          status: o.status,
          image:
            o.items?.[0]?.image ||
            'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200',
          itemsCount: o.items?.length || 1,
        }))
      : fallbackOrders.slice(0, 5).map((o) => ({
          id: o.id,
          customer: o.customer,
          date: o.date,
          total: o.total,
          payment: o.payment,
          status: o.status,
          image: o.items[0].image,
          itemsCount: o.items.length,
        }));

  const topSelling =
    data?.topSelling && data.topSelling.length > 0
      ? data.topSelling.map((p) => {
          let img = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200';
          try {
            const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
            if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
          } catch {}
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            discountPrice: p.discountPrice,
            sold: p.popularity || 42,
            image: img,
          };
        })
      : fallbackProducts.slice(0, 5).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          discountPrice: p.discountPrice,
          sold: p.sold,
          image: p.image,
        }));

  const lowStock =
    data?.lowStock && data.lowStock.length > 0
      ? data.lowStock.map((p) => ({
          id: p.id,
          name: p.name,
          sku: p.sku || 'TGD-PRD',
          stock: p.stock,
          lowStockAt: p.lowStockAt || 5,
        }))
      : fallbackProducts.filter((p) => p.stock <= p.lowStockAt).slice(0, 3);

  const quickActions = [
    { label: 'Add Product', description: 'List a new décor piece', to: '/admin/products/new', icon: PackagePlusIcon },
    { label: 'View Orders', description: `${pendingOrders} awaiting fulfillment`, to: '/admin/orders', icon: ShoppingBagIcon },
    { label: 'Create Coupon', description: 'Run a seasonal promotion', to: '/admin/coupons', icon: TicketPercentIcon },
  ];

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}`}
        subtitle="Here's how Tagdiah Home Décor & Arts is performing today."
      >
        <Button variant="secondary" icon={CalendarDaysIcon}>
          {currentDate}
        </Button>
        <Button
          variant="secondary"
          icon={DownloadIcon}
          onClick={() => {
            const headers = ['Metric Key', 'Value', 'Notes'];
            const rows = [
              ['Total Net Sales (BDT)', totalSales, 'Live net revenue'],
              ['Total Orders Count', totalOrders, `${pendingOrders} pending confirmation`],
              ['Pending Orders', pendingOrders, 'Awaiting fulfillment'],
              ['Total Registered Customers', totalCustomers, 'Shopper accounts'],
              ['Total Catalogue Products', totalProducts, `${lowStockCount} items low on stock`],
              ['Low Stock Items Count', lowStockCount, 'At or below threshold'],
              ['Average Order Value (BDT)', avgOrderValue, 'Per customer basket'],
            ];
            exportToCSV(`Tagdiah_Executive_Summary_${new Date().toISOString().split('T')[0]}`, headers, rows);
            toast('success', 'Executive Summary Exported', 'Dashboard metrics exported as CSV report.');
          }}
        >
          Export Report
        </Button>
      </PageHeader>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total sales"
          value={bdt(totalSales)}
          delta={12.4}
          caption="Live net revenue"
          icon={BanknoteIcon}
          emphasis
        />
        <StatCard
          label="Total orders"
          value={String(totalOrders)}
          delta={8.6}
          caption={`${pendingOrders} awaiting dispatch`}
          icon={ShoppingBagIcon}
        />
        <StatCard
          label="Registered customers"
          value={String(totalCustomers)}
          delta={6.2}
          caption="Verified accounts"
          icon={UsersIcon}
        />
        <StatCard
          label="Active catalogue"
          value={String(totalProducts)}
          delta={0.0}
          caption={`${lowStockCount} items low on stock`}
          icon={PackageIcon}
        />
      </div>

      {/* ── Revenue Chart & Quick Actions ── */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader
            title="Revenue overview"
            subtitle="Net revenue from confirmed orders and shipments"
            action={<Legend items={[{ label: 'Net Sales', color: chartColors.brown }]} />}
          />

          <div className="px-3 py-4">
            <RevenueArea height={272} />
          </div>
          <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
            {[
              { k: 'Avg. order value', v: bdt(avgOrderValue) },
              { k: 'Active Channel', v: 'Direct & COD' },
              { k: 'Payment Method', v: 'Cash on Delivery (100%)' },
            ].map((s) => (
              <div key={s.k} className="px-5 py-3.5">
                <p className="text-[12px] text-ink-50">{s.k}</p>
                <p className="mt-0.5 text-sm font-medium text-ink">{s.v}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <Card>
            <CardHeader title="Quick actions" />
            <div className="p-2">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-150 ease-out hover:bg-cream"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-cream text-brown">
                    <a.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{a.label}</span>
                    <span className="block truncate text-[12px] text-ink-50">{a.description}</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-ink-30 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-brown" />
                </Link>
              ))}
            </div>
          </Card>

          <Card className="flex-1">
            <CardHeader title="Recent activity" />
            <ol className="p-5 pt-4">
              {activity.slice(0, 5).map((a, i, arr) => (
                <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < arr.length - 1 ? <span className="absolute left-[5px] top-4 h-full w-px bg-line" /> : null}
                  <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brown bg-surface" />
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug text-ink-70">
                      <span className="font-medium text-ink">{a.actor}</span> {a.action}{' '}
                      <span className="font-medium text-brown">{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-ink-30">{a.at}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>

      {/* ── Recent Orders & Top Selling ── */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader
            title="Recent orders"
            subtitle="Latest orders submitted across the storefront"
            action={
              <Link to="/admin/orders" className="text-[13px] font-medium text-brown hover:underline">
                View all ({totalOrders})
              </Link>
            }
          />

          <ul className="divide-y divide-line">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link
                  to={`/admin/orders/${o.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 ease-out hover:bg-cream/50"
                >
                  <img src={o.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-line" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink font-mono">#{o.id}</p>
                    <p className="truncate text-[12.5px] text-ink-50">
                      {o.customer} · {o.itemsCount} item{o.itemsCount > 1 ? 's' : ''} · {shortDate(o.date)}
                    </p>
                  </div>
                  <StatusPill status={o.payment} />
                  <StatusPill status={o.status} />
                  <p className="w-24 text-right text-sm font-medium text-ink">{bdt(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader title="Top-selling pieces" subtitle="Ranked by customer demand" />
          <ol className="divide-y divide-line">
            {topSelling.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-4 font-display text-sm text-ink-30">{i + 1}</span>
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-line" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{p.name}</p>
                  <p className="text-[12px] text-ink-50">
                    Popularity score: {p.sold} · {bdt(p.discountPrice ?? p.price)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* ── Order Performance & Low Stock ── */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader
            title="Order performance"
            subtitle="Placed, confirmed and delivered breakdown"
            action={
              <Legend
                items={[
                  { label: 'Placed', color: chartColors.brown },
                  { label: 'Delivered', color: chartColors.sage },
                  { label: 'Returned', color: chartColors.terracotta },
                ]}
              />
            }
          />

          <div className="px-3 py-4">
            <OrdersBar height={236} />
          </div>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader
            title="Low-stock products"
            subtitle={`${lowStock.length} items at or below reorder threshold`}
            action={
              <Link to="/admin/inventory" className="text-[13px] font-medium text-brown hover:underline">
                Manage
              </Link>
            }
          />

          <ul className="divide-y divide-line">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-tint text-gold">
                  <AlertTriangleIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{p.name}</p>
                  <p className="text-[12px] text-ink-50">
                    {p.sku} · reorder threshold at {p.lowStockAt}
                  </p>
                </div>
                <p className={`text-sm font-semibold ${p.stock === 0 ? 'text-danger' : 'text-gold'}`}>
                  {p.stock} left
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* ── Recent Reviews Preview ── */}
      <div className="mt-4">
        <Card>
          <CardHeader
            title="Customer reviews"
            subtitle="Verified feedback from homeowners"
            action={
              <Link to="/admin/reviews" className="text-[13px] font-medium text-brown hover:underline">
                Moderate reviews
              </Link>
            }
          />

          <ul className="grid grid-cols-1 divide-y divide-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {fallbackReviews.slice(0, 3).map((r) => (
              <li key={r.id} className="flex flex-col p-5">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{r.customer}</p>
                    <p className="truncate text-[12px] text-ink-50">{r.product}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-beige'}`}
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-70">“{r.text}”</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-[11.5px] text-ink-30">{shortDate(r.date)}</span>
                  <StatusPill status={r.status} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}