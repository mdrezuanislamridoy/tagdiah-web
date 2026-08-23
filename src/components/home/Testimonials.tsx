import React from 'react';
import { StarIcon } from 'lucide-react';
import { testimonials } from '../../data/content';
import { cx } from '../../utils/format';

export function Testimonials() {
  return (
    <section className="border-y border-sand bg-warmwhite">
      <div className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-clay">4.8 average from 1,240 reviews</p>
          <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
            What people say once it is on the wall
          </h2>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-14">
          {testimonials.map((item) =>
          <figure key={item.id} className="flex h-full flex-col border-t border-ink/15 pt-7">
              <div className="flex items-center gap-1" aria-label={`Rated ${item.rating} out of 5`}>
                {[1, 2, 3, 4, 5].map((star) =>
              <StarIcon
                key={star}
                aria-hidden="true"
                className={cx('h-3.5 w-3.5', star <= item.rating ? 'fill-gold text-gold' : 'text-dune')}
                strokeWidth={1.5} />

              )}
              </div>
              <blockquote className="mt-5 font-display text-xl font-light leading-relaxed text-ink lg:text-[1.375rem]">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-auto pt-7 text-sm">
                <span className="block text-ink">{item.author}</span>
                <span className="mt-1 block text-smoke">{item.location}</span>
                <span className="mt-3 block text-xs uppercase tracking-widest text-bark">
                  {item.product}
                </span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>);

}