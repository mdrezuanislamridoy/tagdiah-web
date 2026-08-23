import React, { useState } from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { productReviews, ratingBreakdown } from '../../data/content';
import type { Product } from '../../types';

export function ReviewsSection({ product }: {product: Product;}) {
  const reviews = productReviews.default;
  const [visible, setVisible] = useState(3);
  const total = ratingBreakdown.reduce((sum, row) => sum + row.count, 0);

  return (
    <section id="reviews" className="border-t border-sand bg-warmwhite">
      <div className="mx-auto max-w-shell px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-clay">Customer reviews</p>
            <div className="mt-4 flex items-end gap-4">
              <span className="font-display text-6xl font-light leading-none text-ink">
                {product.rating.toFixed(1)}
              </span>
              <div className="pb-1">
                <Rating value={product.rating} size="md" />
                <p className="mt-2 text-xs text-smoke">{product.reviewCount} verified reviews</p>
              </div>
            </div>

            <ul className="mt-8 space-y-2.5">
              {ratingBreakdown.map((row) =>
              <li key={row.stars} className="flex items-center gap-3 text-xs text-smoke">
                  <span className="w-8">{row.stars} ★</span>
                  <span className="h-1.5 flex-1 bg-sand">
                    <span
                    className="block h-full bg-gold"
                    style={{ width: `${row.count / total * 100}%` }} />
                  
                  </span>
                  <span className="w-8 text-right">{row.count}</span>
                </li>
              )}
            </ul>

            <Button variant="secondary" className="mt-8 w-full">
              Write a review
            </Button>
          </div>

          <div>
            <ul className="divide-y divide-sand border-t border-sand">
              {reviews.slice(0, visible).map((review) =>
              <li key={review.id} className="py-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <Rating value={review.rating} />
                    {review.verified &&
                  <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-bark">
                        <CheckCircle2Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        Verified purchase
                      </span>
                  }
                    <span className="ml-auto text-xs text-smoke">{review.date}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-light text-ink">{review.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-smoke">{review.body}</p>
                  <p className="mt-4 text-xs text-smoke">
                    <span className="text-ink">{review.author}</span> · {review.location}
                  </p>
                </li>
              )}
            </ul>
            {visible < reviews.length &&
            <Button variant="quiet" className="mt-8" onClick={() => setVisible(reviews.length)}>
                Read all {product.reviewCount} reviews
              </Button>
            }
          </div>
        </div>
      </div>
    </section>);

}