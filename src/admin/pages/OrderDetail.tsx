import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PrinterIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CreditCardIcon,
  TruckIcon,
  CheckIcon,
  UserIcon,
  Loader2Icon,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { orders as seedOrders, orderStatuses } from '../data/orders';
import { bdt, shortDate, classNames } from '../utils/format';
import { api } from '../../utils/api';
import type { Order, OrderStatus } from '../types';

export function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [cancelOpen, setCancelOpen] = useState(false);

  /* Load order details dynamically from backend */
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api
      .get<any>(`/orders/${id}`)
      .then((o) => {
        if (o) {
          const mapped: Order = {
            id: o.orderNumber || o.id,
            customerId: o.customerId || 'c-01',
            customer: o.customerName || o.customer?.name || 'Customer',
            email: o.email || o.customer?.email || 'customer@example.com',
            phone: o.phone || o.customer?.phone || '+880 1700 000 000',
            address: o.address,
            city: o.city,
            date: o.createdAt ? o.createdAt.split('T')[0] : '2026-08-26',
            items: (o.items || []).map((it: any) => ({
              productId: it.productId || 'p-01',
              name: it.name,
              image:
                it.image ||
                'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=200',
              variant: it.variant || 'Standard',
              qty: it.qty,
              price: it.price,
            })),
            subtotal: o.subtotal,
            delivery: o.delivery,
            discount: o.discount,
            total: o.total,
            payment: o.payment === 'Paid' ? 'Paid' : 'COD',
            method: o.method || 'COD',
            status: o.status as OrderStatus,
            courier: o.courier || 'Pathao Courier',
            tracking: o.tracking || 'PT-Live',
            timeline: [
              { label: 'Order placed', at: o.createdAt ? shortDate(o.createdAt.split('T')[0]) : 'Today', done: true },
              {
                label: 'Order confirmed',
                at: ['Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(o.status) ? 'Confirmed' : 'Pending',
                done: ['Confirmed', 'Processing', 'Shipped', 'Delivered'].includes(o.status),
              },
              {
                label: 'Packed & handed to courier',
                at: ['Shipped', 'Delivered'].includes(o.status) ? 'Handed over' : 'Pending',
                done: ['Shipped', 'Delivered'].includes(o.status),
              },
              {
                label: 'Out for delivery',
                at: o.status === 'Delivered' ? 'Delivered' : 'In transit',
                done: o.status === 'Delivered',
              },
            ],
          };
          setOrder(mapped);
          setStatus(mapped.status);
        }
      })
      .catch(() => {
        // Fallback to local mock if exists
        const fallback = seedOrders.find((x) => x.id === id);
        if (fallback) {
          setOrder(fallback);
          setStatus(fallback.status);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = async (v: string) => {
    const nextStatus = v as OrderStatus;
    setStatus(nextStatus);
    if (order) {
      setOrder({ ...order, status: nextStatus });
      try {
        await api.patch(`/orders/${order.id}/status`, { status: nextStatus });
        toast('success', 'Order status updated', `${order.id} is now marked as ${v}.`);
      } catch (err: any) {
        toast('error', 'Failed to update', err?.message || 'Server error.');
      }
    }
  };

  const handleCancelOrder = async () => {
    if (order) {
      await handleStatusChange('Cancelled');
      setCancelOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-brown" />
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <EmptyState
          icon={UserIcon}
          title="Order not found"
          description="This order may have been deleted or the link is out of date."
          action={
            <Link to="/admin/orders">
              <Button variant="secondary">Back to orders</Button>
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/admin/orders"
            className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-ink-50 hover:text-brown"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl leading-tight text-ink font-mono">#{order.id}</h1>
            <StatusPill status={status} />
            <StatusPill status={order.payment} />
          </div>
          <p className="mt-1 text-sm text-ink-50">
            Placed {shortDate(order.date)} · {order.items.reduce((s, i) => s + i.qty, 0)} items · {order.method}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            label="Update order status"
            value={status}
            onChange={handleStatusChange}
            options={orderStatuses}
            className="w-[170px]"
          />

          <Button
            variant="secondary"
            icon={PrinterIcon}
            onClick={() => {
              window.print();
              toast('info', 'Printing invoice', `Invoice for #${order.id}`);
            }}
          >
            Print invoice
          </Button>
          <Button variant="danger" onClick={() => setCancelOpen(true)}>
            Cancel order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <Card>
            <CardHeader title="Ordered products" subtitle={`${order.items.length} line items`} />
            <ul className="divide-y divide-line">
              {order.items.map((it, idx) => (
                <li key={`${it.productId}-${idx}`} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={it.image}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover border border-line"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                    <p className="text-[12.5px] text-ink-50">
                      {it.variant} · {bdt(it.price)} each
                    </p>
                  </div>
                  <span className="text-[13px] text-ink-50">× {it.qty}</span>
                  <span className="w-24 text-right text-sm font-medium text-ink">
                    {bdt(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-line bg-cream/40 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-50">Subtotal</dt>
                <dd className="text-ink">{bdt(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-50">Delivery fee</dt>
                <dd className="text-ink">{order.delivery === 0 ? 'Free' : bdt(order.delivery)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink-50">Discount</dt>
                  <dd className="text-sage">−{bdt(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-2.5">
                <dt className="font-medium text-ink">Total Due on Delivery (COD)</dt>
                <dd className="font-display text-lg text-ink font-semibold">{bdt(order.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader
              title="Order timeline"
              subtitle="Every status change is logged automatically"
            />
            <ol className="p-5">
              {order.timeline.map((t, i, arr) => (
                <li key={t.label} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < arr.length - 1 ? (
                    <span
                      className={classNames(
                        'absolute left-[13px] top-7 h-full w-px',
                        t.done ? 'bg-brown/30' : 'bg-line'
                      )}
                    />
                  ) : null}
                  <span
                    className={classNames(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                      t.done
                        ? 'border-brown bg-brown text-white'
                        : 'border-line bg-surface text-ink-30'
                    )}
                  >
                    {t.done ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className={classNames('text-sm font-medium', t.done ? 'text-ink' : 'text-ink-30')}>
                      {t.label}
                    </p>
                    <p className="text-[12.5px] text-ink-50">
                      {t.at}
                      {t.note ? ` · ${t.note}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Card>
            <CardHeader title="Customer" />
            <div className="space-y-3 p-5 text-[13px]">
              <p className="flex items-center gap-2.5 text-ink font-medium">
                <UserIcon className="h-4 w-4 text-ink-30" /> {order.customer}
              </p>
              <p className="flex items-center gap-2.5 text-ink-70">
                <MailIcon className="h-4 w-4 text-ink-30" /> {order.email}
              </p>
              <p className="flex items-center gap-2.5 text-ink-70">
                <PhoneIcon className="h-4 w-4 text-ink-30" /> {order.phone}
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Delivery address" />
            <div className="p-5">
              <p className="flex gap-2.5 text-[13px] leading-relaxed text-ink-70">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-30" />
                <span>
                  {order.address}, {order.city}
                </span>
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Payment details" />
            <div className="space-y-2 p-5 text-[13px] text-ink-70">
              <p className="flex items-center gap-2 text-ink font-medium">
                <CreditCardIcon className="h-4 w-4 text-ink-30" /> Cash on Delivery (COD)
              </p>
              <p>Payment will be collected by courier upon doorstep delivery.</p>
              <p className="pt-2 text-xs text-ink-50">
                Status:{' '}
                <span className="font-medium text-ink">
                  {order.payment === 'Paid' ? 'Paid' : 'Unpaid (Due at Doorstep)'}
                </span>
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Fulfillment & Courier" />
            <div className="space-y-2.5 p-5 text-[13px] text-ink-70">
              <p className="flex items-center gap-2 text-ink font-medium">
                <TruckIcon className="h-4 w-4 text-ink-30" /> {order.courier}
              </p>
              <p className="font-mono text-xs text-ink-50">Tracking: {order.tracking}</p>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelOrder}
        title={`Cancel order #${order.id}?`}
        message="This will mark the order as Cancelled and return reserved inventory units."
      />
    </>
  );
}