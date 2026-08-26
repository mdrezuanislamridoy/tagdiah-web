import React, { useState, useEffect } from 'react';
import { CheckCircle2Icon, StarIcon, XIcon, Loader2Icon } from 'lucide-react';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { productReviews, ratingBreakdown as initialBreakdown } from '../../data/content';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import type { Product, Review } from '../../types';

interface ReviewsResponse {
  reviews: any[];
  averageRating: number;
  totalCount: number;
  breakdown: { stars: number; count: number }[];
}

export function ReviewsSection({ product }: { product: Product }) {
  const { user, isAuthenticated } = useAuth();
  const [reviewsList, setReviewsList] = useState<Review[]>(productReviews.default);
  const [avgRating, setAvgRating] = useState(product.rating || 4.9);
  const [reviewCount, setReviewCount] = useState(product.reviewCount || 12);
  const [breakdown, setBreakdown] = useState(initialBreakdown);
  const [visible, setVisible] = useState(3);

  /* Modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorInput, setAuthorInput] = useState(user?.name || '');
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [titleInput, setTitleInput] = useState('');
  const [bodyInput, setBodyInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* Load real reviews from backend */
  const loadProductReviews = () => {
    if (!product.id && !product.slug) return;
    const target = product.id || product.slug;
    api
      .get<ReviewsResponse>(`/reviews/product/${target}`)
      .then((data) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const mapped: Review[] = data.reviews.map((r) => ({
            id: r.id,
            author: r.author,
            location: 'Dhaka, BD',
            rating: r.rating,
            date: new Date(r.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            title: r.title || 'Exceptional craftsmanship',
            body: r.body,
            verified: r.verified ?? true,
          }));

          // Merge backend reviews with initial sample reviews for rich aesthetics
          const combined = [...mapped];
          productReviews.default.forEach((pr) => {
            if (!combined.some((c) => c.id === pr.id)) combined.push(pr);
          });

          setReviewsList(combined);
          if (data.totalCount > 0) {
            setAvgRating(data.averageRating);
            setReviewCount(combined.length);
            setBreakdown(data.breakdown);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadProductReviews();
  }, [product.id, product.slug]);

  const totalBreakdownCount = breakdown.reduce((sum, row) => sum + row.count, 0) || 1;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bodyInput.trim() || !authorInput.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        productId: product.id || product.slug,
        author: authorInput.trim(),
        email: emailInput.trim() || user?.email,
        rating: ratingInput,
        title: titleInput.trim() || 'Verified Customer Review',
        body: bodyInput.trim(),
      };

      const res = await api.post<any>('/reviews', payload);

      const newReview: Review = {
        id: res?.id || `rev-${Date.now()}`,
        author: authorInput.trim(),
        location: user?.city || 'Dhaka, BD',
        rating: ratingInput,
        date: 'Just now',
        title: titleInput.trim() || 'Verified Customer Review',
        body: bodyInput.trim(),
        verified: true,
      };

      setReviewsList((prev) => [newReview, ...prev]);
      setReviewCount((c) => c + 1);
      setSubmittedMessage(true);
      setTimeout(() => {
        setSubmittedMessage(false);
        setModalOpen(false);
        setTitleInput('');
        setBodyInput('');
      }, 1800);
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Only verified buyers who have purchased this product can leave a review.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="border-t border-sand bg-warmwhite">
      <div className="mx-auto max-w-shell px-5 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
          {/* Summary Column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow text-clay">Customer reviews</p>
            <div className="mt-4 flex items-end gap-4">
              <span className="font-display text-6xl font-light leading-none text-ink">
                {avgRating.toFixed(1)}
              </span>
              <div className="pb-1">
                <Rating value={avgRating} size="md" />
                <p className="mt-2 text-xs text-smoke">{reviewCount} verified reviews</p>
              </div>
            </div>

            {/* Rating distribution bar */}
            <ul className="mt-8 space-y-2.5">
              {breakdown.map((row) => (
                <li key={row.stars} className="flex items-center gap-3 text-xs text-smoke">
                  <span className="w-8">{row.stars} ★</span>
                  <span className="h-1.5 flex-1 bg-sand overflow-hidden rounded-full">
                    <span
                      className="block h-full bg-gold transition-all duration-300"
                      style={{ width: `${(row.count / totalBreakdownCount) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-right">{row.count}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="secondary"
              className="mt-8 w-full"
              onClick={() => {
                if (user?.name && !authorInput) setAuthorInput(user.name);
                setModalOpen(true);
              }}
            >
              Write a review
            </Button>
          </div>

          {/* Reviews List Column */}
          <div>
            <ul className="divide-y divide-sand border-t border-sand">
              {reviewsList.slice(0, visible).map((review) => (
                <li key={review.id} className="py-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <Rating value={review.rating} />
                    {review.verified && (
                      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-bark">
                        <CheckCircle2Icon className="h-3.5 w-3.5 text-sage" strokeWidth={1.5} />
                        Verified purchase
                      </span>
                    )}
                    <span className="ml-auto text-xs text-smoke">{review.date}</span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-light text-ink">{review.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-smoke">{review.body}</p>
                  <p className="mt-4 text-xs text-smoke">
                    <span className="text-ink font-medium">{review.author}</span> · {review.location}
                  </p>
                </li>
              ))}
            </ul>

            {visible < reviewsList.length && (
              <Button
                variant="quiet"
                className="mt-8"
                onClick={() => setVisible((v) => v + 5)}
              >
                Read more reviews ({reviewsList.length - visible} remaining)
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Write a Review Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg border border-sand bg-warmwhite p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 text-smoke hover:text-ink transition-colors"
            >
              <XIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {submittedMessage ? (
              <div className="py-10 text-center">
                <CheckCircle2Icon className="mx-auto h-12 w-12 text-sage" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-2xl text-ink">Thank you for your review!</h3>
                <p className="mt-2 text-sm text-smoke">
                  Your feedback helps other homeowners discover handcrafted pieces.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <p className="eyebrow text-clay">Share your experience</p>
                  <h2 className="mt-1 font-display text-2xl font-light text-ink">
                    Review {product.name}
                  </h2>
                </div>

                {errorMessage && (
                  <div className="rounded border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-800 leading-relaxed font-medium">
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Email Input for Purchase Verification */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-smoke mb-1.5">
                    Order Email (For Purchase Verification)
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="The email address used during order checkout"
                    className="w-full border border-sand bg-cream/40 px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                {/* Rating Picker */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-smoke mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || ratingInput) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRatingInput(star)}
                          className="p-1 text-gold transition-transform hover:scale-110"
                        >
                          <StarIcon
                            className={`h-7 w-7 ${
                              active ? 'fill-gold text-gold' : 'text-sand fill-transparent'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-3 text-sm font-medium text-ink font-mono">
                      {hoverRating || ratingInput} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Author Name */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-smoke mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authorInput}
                    onChange={(e) => setAuthorInput(e.target.value)}
                    placeholder="e.g. Farhana Yasmin"
                    className="w-full border border-sand bg-cream/40 px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                {/* Review Title */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-smoke mb-1.5">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="e.g. Beautiful organic texture and drape"
                    className="w-full border border-sand bg-cream/40 px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                {/* Review Body */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-smoke mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={bodyInput}
                    onChange={(e) => setBodyInput(e.target.value)}
                    placeholder="Tell us about the craftsmanship, materials, feel, and how it pairs with your home space..."
                    className="w-full border border-sand bg-cream/40 px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="quiet"
                    onClick={() => setModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting || !bodyInput.trim() || !authorInput.trim()}>
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2Icon className="h-4 w-4 animate-spin" /> Submitting…
                      </span>
                    ) : (
                      'Post Review'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}