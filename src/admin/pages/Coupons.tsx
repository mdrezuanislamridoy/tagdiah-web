import React, { useState, useEffect } from 'react';
import { PlusIcon, CopyIcon, PencilIcon, Trash2Icon, TicketPercentIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextInput, Toggle } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { coupons as seed } from '../data/marketing';
import { bdt, shortDate } from '../utils/format';
import { api } from '../../utils/api';
import type { Coupon } from '../types';

const blank = {
  code: '',
  type: 'Percentage',
  amount: '',
  minOrder: '',
  expires: '',
  limit: '',
  active: true,
};

export function Coupons() {
  const toast = useToast();
  const [items, setItems] = useState<Coupon[]>(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [draft, setDraft] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Coupon | null>(null);
  const [filter, setFilter] = useState('All coupons');
  const [submitting, setSubmitting] = useState(false);

  /* Load real coupons from backend */
  const loadCoupons = () => {
    api
      .get<any[]>('/coupons')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Coupon[] = data.map((c) => ({
            id: c.id,
            code: c.code,
            type: c.type as Coupon['type'],
            amount: c.amount,
            minOrder: c.minOrder,
            expires: c.expires ? c.expires.split('T')[0] : '2026-12-31',
            limit: c.limit,
            used: c.used,
            status: c.status as Coupon['status'],
          }));
          setItems(mapped);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const filtered = items.filter((c) => filter === 'All coupons' || c.status === filter);

  const openNew = () => {
    setEditing(null);
    setDraft(blank);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setDraft({
      code: c.code,
      type: c.type,
      amount: String(c.amount),
      minOrder: String(c.minOrder),
      expires: c.expires,
      limit: String(c.limit),
      active: c.status === 'Active',
    });
    setErrors({});
    setOpen(true);
  };

  const save = async () => {
    const e: Record<string, string> = {};
    if (!draft.code.trim()) e.code = 'Coupon code is required.';
    if (draft.type !== 'Free Delivery' && !Number(draft.amount))
      e.amount = 'Enter a discount value.';
    if (!draft.expires) e.expires = 'Pick an expiry date.';
    setErrors(e);
    if (Object.keys(e).length) {
      toast('error', 'Coupon not saved', 'Fill in the highlighted fields.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: draft.code.toUpperCase().trim(),
        type: draft.type,
        amount: Number(draft.amount) || 0,
        minOrder: Number(draft.minOrder) || 0,
        expires: draft.expires ? `${draft.expires}T23:59:59.000Z` : undefined,
        limit: Number(draft.limit) || 100,
        status: draft.active ? 'Active' : 'Inactive',
      };

      if (editing) {
        await api.put(`/coupons/${editing.id}`, payload);
        toast('success', 'Coupon updated', `${payload.code} was saved successfully.`);
      } else {
        await api.post('/coupons', payload);
        toast('success', 'Coupon created', `${payload.code} is now ready for shoppers.`);
      }

      loadCoupons();
      setOpen(false);
    } catch (err: any) {
      toast('error', 'Failed to save coupon', err?.message || 'Server error.');
    } finally {
      setSubmitting(false);
    }
  };

  const describe = (c: Coupon) =>
    c.type === 'Percentage'
      ? `${c.amount}% off`
      : c.type === 'Fixed'
      ? `${bdt(c.amount)} off`
      : 'Free delivery';

  return (
    <>
      <PageHeader
        title="Coupons & Discounts"
        subtitle={`${items.filter((c) => c.status === 'Active').length} active codes running right now`}
      >
        <Select
          label="Filter coupons"
          value={filter}
          onChange={setFilter}
          options={['All coupons', 'Active', 'Scheduled', 'Expired', 'Inactive']}
          className="w-[170px]"
        />
        <Button icon={PlusIcon} onClick={openNew}>
          Create coupon
        </Button>
      </PageHeader>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState
            icon={TicketPercentIcon}
            title="No coupons in this view"
            description="Create a code to run a seasonal offer or reward repeat customers."
            action={<Button icon={PlusIcon} onClick={openNew}>Create coupon</Button>}
          />
        ) : (
          <TableShell>
            <thead>
              <tr>
                <Th>Code</Th>
                <Th>Discount</Th>
                <Th>Minimum order</Th>
                <Th>Usage</Th>
                <Th>Expires</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const pct = c.limit ? Math.min(100, Math.round((c.used / c.limit) * 100)) : 0;
                return (
                  <Tr key={c.id}>
                    <Td>
                      <span className="rounded-md border border-dashed border-beige bg-cream px-2.5 py-1 font-mono text-[13px] font-medium tracking-wide text-ink">
                        {c.code}
                      </span>
                    </Td>
                    <Td className="font-medium text-ink">{describe(c)}</Td>
                    <Td>{c.minOrder ? bdt(c.minOrder) : 'No minimum'}</Td>
                    <Td>
                      <div className="w-36">
                        <div className="flex justify-between text-[12px] text-ink-50">
                          <span>
                            {c.used} / {c.limit}
                          </span>
                          <span>{pct}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige">
                          <div className="h-full rounded-full bg-brown" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap text-[13px]">{shortDate(c.expires)}</Td>
                    <Td>
                      <StatusPill status={c.status} />
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        <IconButton
                          label={`Copy ${c.code}`}
                          icon={CopyIcon}
                          onClick={() => {
                            navigator.clipboard?.writeText(c.code);
                            toast('success', 'Code copied', `${c.code} is on your clipboard.`);
                          }}
                        />
                        <IconButton label="Edit coupon" icon={PencilIcon} onClick={() => openEdit(c)} />
                        <IconButton
                          label="Delete coupon"
                          icon={Trash2Icon}
                          onClick={() => setToDelete(c)}
                          className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger"
                        />
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit coupon' : 'Create new coupon'}
        description="Coupons apply discounts at storefront checkout and shopping cart."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={save} disabled={submitting}>
              {submitting ? 'Saving…' : editing ? 'Save changes' : 'Create coupon'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Coupon code" required error={errors.code}>
            <TextInput
              value={draft.code}
              onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
              placeholder="e.g. MONSOON15"
              className="font-mono uppercase tracking-wider font-semibold"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Discount type">
              <Select
                label="Type"
                value={draft.type}
                onChange={(v) => setDraft({ ...draft, type: v })}
                options={['Percentage', 'Fixed', 'Free Delivery']}
              />
            </Field>
            <Field
              label={draft.type === 'Percentage' ? 'Discount %' : 'Discount amount (৳)'}
              required={draft.type !== 'Free Delivery'}
              error={errors.amount}
            >
              <TextInput
                type="number"
                disabled={draft.type === 'Free Delivery'}
                value={draft.type === 'Free Delivery' ? '0' : draft.amount}
                onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                placeholder={draft.type === 'Percentage' ? '15' : '500'}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Minimum order value (৳)" hint="0 for no minimum">
              <TextInput
                type="number"
                value={draft.minOrder}
                onChange={(e) => setDraft({ ...draft, minOrder: e.target.value })}
                placeholder="2000"
              />
            </Field>
            <Field label="Total usage limit" hint="Max times code can be redeemed">
              <TextInput
                type="number"
                value={draft.limit}
                onChange={(e) => setDraft({ ...draft, limit: e.target.value })}
                placeholder="500"
              />
            </Field>
          </div>

          <Field label="Expiry date" required error={errors.expires}>
            <TextInput
              type="date"
              value={draft.expires}
              onChange={(e) => setDraft({ ...draft, expires: e.target.value })}
            />
          </Field>

          <Toggle
            label="Active coupon"
            description="When active, shoppers can apply this code on cart and checkout."
            checked={draft.active}
            onChange={(c) => setDraft({ ...draft, active: c })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) {
            try {
              await api.delete(`/coupons/${toDelete.id}`);
            } catch {}
            setItems((list) => list.filter((c) => c.id !== toDelete.id));
            toast('success', 'Coupon deleted', `${toDelete.code} was removed.`);
            setToDelete(null);
          }
        }}
        title="Delete coupon?"
        message={`Delete ${toDelete?.code ?? ''}? Customers will no longer be able to use this code at checkout.`}
      />
    </>
  );
}