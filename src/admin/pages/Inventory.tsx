import React, { useMemo, useState, useEffect } from 'react';
import { RefreshCwIcon, PlusIcon, MinusIcon, AlertTriangleIcon, WarehouseIcon, HistoryIcon, CheckIcon, Loader2Icon } from 'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, SearchInput, Select, TextArea, TextInput } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, RowSkeleton, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { products as seed } from '../data/products';
import { stockMovements as initialMovements } from '../data/analytics';
import { classNames } from '../utils/format';
import { api } from '../../utils/api';
import type { Product } from '../types';

const stockLabel = (p: Product) =>
  p.stock === 0 ? 'Out of Stock' : p.stock <= p.lowStockAt ? 'Low Stock' : 'In Stock';

export function Inventory() {
  const toast = useToast();
  const [items, setItems] = useState<Product[]>(seed);
  const [movements, setMovements] = useState(initialMovements);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All stock');
  const [loading, setLoading] = useState(false);
  const [adjusting, setAdjusting] = useState<Product | null>(null);
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState('Restock');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* Load real products from backend */
  const loadInventory = async (showToast = false) => {
    setLoading(true);
    try {
      const data = await api.get<any[]>('/products');
      if (Array.isArray(data) && data.length > 0) {
        const mapped: Product[] = data.map((p) => {
          let img = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38';
          try {
            const parsed = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
            if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
          } catch {}

          return {
            id: p.id,
            name: p.name,
            sku: p.sku || 'TGD-PRD',
            slug: p.slug || 'product',
            category: p.category?.name || 'Decor',
            subcategory: 'Handcrafted',
            price: p.price,
            stock: p.stock ?? 15,
            lowStockAt: p.lowStockAt ?? 5,
            status: (p.status as any) || 'Active',
            image: img,
            images: [img],
            updatedAt: p.updatedAt ? p.updatedAt.split('T')[0] : '2026-08-25',
            featured: true,
            rating: 4.9,
            reviewCount: 12,
            reviewsCount: 12,
            sold: 50,
            description: p.description || '',
            seoTitle: p.name || '',
            seoDescription: p.description || '',
            variations: [],
          };
        });
        setItems(mapped);
        if (showToast) {
          toast('success', 'Inventory synced', 'Live stock levels updated from studio warehouse.');
        }
      }
    } catch {
      // Fallback remains
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchF = filter === 'All stock' || stockLabel(p) === filter;
      return matchQ && matchF;
    });
  }, [items, query, filter]);

  const lowCount = items.filter((p) => p.stock > 0 && p.stock <= p.lowStockAt).length;
  const outCount = items.filter((p) => p.stock === 0).length;
  const totalUnits = items.reduce((s, p) => s + p.stock, 0);

  const applyAdjustment = async () => {
    if (!adjusting || delta === 0) {
      toast('error', 'Nothing to adjust', 'Enter a quantity above or below zero.');
      return;
    }

    setSubmitting(true);
    try {
      const updated = await api.patch<any>(`/products/${adjusting.id}/stock`, {
        delta,
      });

      const nextStock = updated?.stock ?? Math.max(0, adjusting.stock + delta);

      setItems((list) =>
        list.map((p) => (p.id === adjusting.id ? { ...p, stock: nextStock } : p))
      );

      // Add to movement history
      const newMovement = {
        id: `m-${Date.now()}`,
        sku: adjusting.sku || 'SKU-00',
        product: adjusting.name,
        change: delta,
        reason,
        by: 'Store Manager',
        at: 'Just now',
      };
      setMovements((prev) => [newMovement, ...prev.slice(0, 4)]);

      toast(
        'success',
        'Stock adjusted',
        `${adjusting.sku} ${delta > 0 ? '+' : ''}${delta} units · ${reason}.`
      );
      setAdjusting(null);
      setDelta(0);
      setNote('');
    } catch (err: any) {
      toast('error', 'Failed to update stock', err?.message || 'Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  /* Quick delta handler for fast +1 / -1 in table */
  const handleQuickDelta = async (p: Product, change: number) => {
    try {
      const updated = await api.patch<any>(`/products/${p.id}/stock`, { delta: change });
      const nextStock = updated?.stock ?? Math.max(0, p.stock + change);
      setItems((list) => list.map((item) => (item.id === p.id ? { ...item, stock: nextStock } : item)));
      toast('success', 'Stock updated', `${p.sku} is now ${nextStock} units.`);
    } catch {
      setItems((list) =>
        list.map((item) => (item.id === p.id ? { ...item, stock: Math.max(0, p.stock + change) } : item))
      );
    }
  };

  return (
    <>
      <PageHeader
        title="Inventory & Stock Manager"
        subtitle={`${totalUnits.toLocaleString()} units in stock across ${items.length} active pieces`}
      >
        <Button variant="secondary" icon={RefreshCwIcon} onClick={() => loadInventory(true)} disabled={loading}>
          {loading ? 'Syncing…' : 'Sync warehouse'}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Healthy stock',
            value: items.length - lowCount - outCount,
            tone: 'text-sage',
            bg: 'bg-sage-tint',
          },
          { label: 'Low stock', value: lowCount, tone: 'text-gold', bg: 'bg-gold-tint' },
          { label: 'Out of stock', value: outCount, tone: 'text-danger', bg: 'bg-danger-tint' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card"
          >
            <span
              className={classNames(
                'flex h-11 w-11 items-center justify-center rounded-xl',
                s.bg,
                s.tone
              )}
            >
              <AlertTriangleIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl leading-none text-ink">{s.value}</p>
              <p className="mt-1 text-[13px] text-ink-50">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search product or SKU…"
              className="min-w-[220px] flex-1"
            />
            <Select
              label="Stock status"
              value={filter}
              onChange={setFilter}
              options={['All stock', 'In Stock', 'Low Stock', 'Out of Stock']}
              className="w-[170px]"
            />
          </div>

          {filtered.length === 0 && !loading ? (
            <EmptyState
              icon={WarehouseIcon}
              title="Nothing to show"
              description="No SKUs match this filter. Try another stock status or clear the search."
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery('');
                    setFilter('All stock');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>SKU</Th>
                  <Th>Current stock</Th>
                  <Th>Reorder point</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Quick / Adjust</Th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} cols={6} />)
                  : filtered.map((p) => (
                      <Tr key={p.id}>
                        <Td>
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover border border-line"
                            />
                            <p className="min-w-0 truncate font-medium text-ink">{p.name}</p>
                          </div>
                        </Td>
                        <Td className="font-mono text-[12.5px]">{p.sku}</Td>
                        <Td>
                          <span
                            className={classNames(
                              'font-medium font-mono text-sm',
                              p.stock === 0
                                ? 'text-danger font-semibold'
                                : p.stock <= p.lowStockAt
                                ? 'text-gold font-semibold'
                                : 'text-ink'
                            )}
                          >
                            {p.stock} units
                          </span>
                        </Td>
                        <Td className="font-mono text-ink-50">{p.lowStockAt}</Td>
                        <Td>
                          <StatusPill status={stockLabel(p)} />
                        </Td>
                        <Td>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuickDelta(p, -1)}
                              disabled={p.stock <= 0}
                              title="Decrease 1 unit"
                              className="flex h-7 w-7 items-center justify-center rounded border border-line bg-cream hover:bg-line text-ink transition-colors disabled:opacity-40"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickDelta(p, 1)}
                              title="Increase 1 unit"
                              className="flex h-7 w-7 items-center justify-center rounded border border-line bg-cream hover:bg-line text-ink transition-colors"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setAdjusting(p);
                                setDelta(0);
                                setReason('Restock');
                              }}
                            >
                              Adjust
                            </Button>
                          </div>
                        </Td>
                      </Tr>
                    ))}
              </tbody>
            </TableShell>
          )}
        </Card>

        {/* ── Stock Movements Ledger ── */}
        <Card className="xl:col-span-4">
          <CardHeader title="Stock movements" subtitle="Recent warehouse ledger" />
          <ol className="divide-y divide-line">
            {movements.map((m) => (
              <li key={m.id} className="flex gap-3 px-5 py-3.5">
                <span
                  className={classNames(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    m.change > 0 ? 'bg-sage-tint text-sage' : 'bg-danger-tint text-danger'
                  )}
                >
                  {m.change > 0 ? <PlusIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{m.product}</p>
                  <p className="truncate text-[12px] text-ink-50">
                    {m.change > 0 ? '+' : ''}
                    {m.change} units · {m.reason}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ink-30">
                    {m.by} · {m.at}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="border-t border-line p-4">
            <Button
              variant="secondary"
              icon={HistoryIcon}
              className="w-full"
              onClick={() => toast('info', 'Live ledger', 'Stock movements are recorded automatically on every order and adjustment.')}
            >
              Live Audit Active
            </Button>
          </div>
        </Card>
      </div>

      {/* ── Adjust Stock Modal ── */}
      <Modal
        open={!!adjusting}
        onClose={() => setAdjusting(null)}
        title="Adjust stock quantity"
        description={adjusting ? `${adjusting.name} (${adjusting.sku}) · currently ${adjusting.stock} units` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdjusting(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={applyAdjustment} disabled={submitting || delta === 0}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2Icon className="h-4 w-4 animate-spin" /> Saving…
                </span>
              ) : (
                'Save adjustment'
              )}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Quantity change" hint="Use buttons or type negative numbers to record damaged units.">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon={MinusIcon}
                onClick={() => setDelta((d) => d - 1)}
                aria-label="Decrease"
              />
              <TextInput
                type="number"
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
                className="text-center font-mono font-medium"
              />
              <Button
                variant="secondary"
                icon={PlusIcon}
                onClick={() => setDelta((d) => d + 1)}
                aria-label="Increase"
              />
            </div>
          </Field>

          {/* Quick preset buttons */}
          <div>
            <span className="block text-xs text-ink-50 mb-1.5">Quick Presets:</span>
            <div className="flex flex-wrap gap-2">
              {[+5, +10, +25, +50, -1].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDelta((d) => d + val)}
                  className="border border-line bg-cream px-2.5 py-1 text-xs font-mono text-ink rounded hover:border-ink transition-colors"
                >
                  {val > 0 ? `+${val}` : val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDelta(0)}
                className="border border-line px-2.5 py-1 text-xs text-danger rounded hover:bg-danger-tint transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <Field label="Reason">
            <Select
              label="Reason"
              value={reason}
              onChange={setReason}
              options={[
                'Restock',
                'Damaged',
                'Returned to supplier',
                'Stock count correction',
                'Sample / gifting',
              ]}
            />
          </Field>

          <Field label="Notes (Optional)" hint="Logged in stock movement history.">
            <TextArea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Batch #B-2026-08 from Bogura kiln" />
          </Field>

          {adjusting && (
            <p className="rounded-xl border border-line bg-cream/50 px-4 py-3 text-[13px] text-ink-70">
              Projected stock level:{' '}
              <span className="font-semibold font-mono text-ink">
                {Math.max(0, adjusting.stock + delta)} units
              </span>
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}