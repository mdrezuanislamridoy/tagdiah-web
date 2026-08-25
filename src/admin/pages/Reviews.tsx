import React, { useMemo, useState, useEffect } from 'react';
import { StarIcon, CheckIcon, XIcon, Trash2Icon, MessageSquareIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState } from '../components/ui/Table';
import { ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { reviews as seed } from '../data/reviews';
import { shortDate } from '../utils/format';
import { api } from '../../utils/api';
import type { Review } from '../types';

export function Reviews() {
  const toast = useToast();
  const [items, setItems] = useState<Review[]>(seed);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All reviews');
  const [rating, setRating] = useState('All ratings');
  const [toDelete, setToDelete] = useState<Review | null>(null);

  const loadReviews = () => {
    api
      .get<any[]>('/reviews')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Review[] = data.map((r) => {
            let img = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38';
            try {
              if (r.product?.images) {
                const parsed = typeof r.product.images === 'string' ? JSON.parse(r.product.images) : r.product.images;
                if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
              }
            } catch {}

            return {
              id: r.id,
              product: r.product?.name || 'Handcrafted Decor Piece',
              productId: r.productId || 'p-01',
              productImage: img,
              customer: r.author || r.customer?.name || 'Verified Customer',
              customerId: r.customerId || 'c-01',
              avatar: r.customer?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
              rating: r.rating,
              date: r.createdAt?.split('T')[0] || '2026-08-25',
              title: r.title || 'Verified review',
              text: r.body,
              status: (r.status as any) || 'Approved',
              verified: r.verified ?? true,
            };
          });
          setItems(mapped);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const matchQ =
        !q ||
        r.product.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q);
      const matchS = status === 'All reviews' || r.status === status;
      const matchR = rating === 'All ratings' || r.rating === Number(rating[0]);
      return matchQ && matchS && matchR;
    });
  }, [items, query, status, rating]);

  const avg = (items.reduce((s, r) => s + r.rating, 0) / Math.max(items.length, 1)).toFixed(1);
  const pending = items.filter((r) => r.status === 'Pending').length;

  const setStatusOf = async (r: Review, next: Review['status']) => {
    try {
      await api.patch(`/reviews/${r.id}/status`, { status: next });
    } catch {}
    setItems((list) => list.map((x) => (x.id === r.id ? { ...x, status: next } : x)));
    toast(
      next === 'Approved' ? 'success' : 'info',
      `Review ${next.toLowerCase()}`,
      `${r.customer}'s review on ${r.product}.`
    );
  };

  return (
    <>
      <PageHeader
        title="Reviews & Ratings"
        subtitle={`${avg} average rating across ${items.length} verified reviews · ${pending} awaiting approval`}
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search product, customer or review text…"
            className="min-w-[240px] flex-1"
          />
          <Select
            label="Approval status"
            value={status}
            onChange={setStatus}
            options={['All reviews', 'Pending', 'Approved', 'Rejected']}
            className="w-[170px]"
          />
          <Select
            label="Rating"
            value={rating}
            onChange={setRating}
            options={['All ratings', '5 stars', '4 stars', '3 stars', '2 stars', '1 star']}
            className="w-[150px]"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquareIcon}
            title="No reviews match this view"
            description="Once customers start reviewing your pieces, they'll appear here for moderation."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('');
                  setStatus('All reviews');
                  setRating('All ratings');
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((r) => (
              <li key={r.id} className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start">
                <img
                  src={r.productImage}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover border border-line"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">{r.product}</p>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                    <img src={r.avatar} alt="" className="h-6 w-6 rounded-full object-cover border border-line" />
                    <span className="text-[13px] text-ink-70 font-medium">{r.customer}</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-beige'}`}
                        />
                      ))}
                    </span>
                    <span className="text-[12px] text-ink-30">{shortDate(r.date)}</span>
                  </div>
                  <p className="mt-2.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-70">
                    “{r.text}”
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={CheckIcon}
                    disabled={r.status === 'Approved'}
                    onClick={() => setStatusOf(r, 'Approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={XIcon}
                    disabled={r.status === 'Rejected'}
                    onClick={() => setStatusOf(r, 'Rejected')}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2Icon}
                    onClick={() => setToDelete(r)}
                    className="text-danger hover:bg-danger-tint"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={async () => {
          if (toDelete) {
            try {
              await api.delete(`/reviews/${toDelete.id}`);
            } catch {}
            setItems((list) => list.filter((x) => x.id !== toDelete.id));
            toast('success', 'Review deleted', 'The customer review was removed.');
            setToDelete(null);
          }
        }}
        title="Delete this review?"
        message="This will remove the review and star rating from the product page permanently."
      />
    </>
  );
}