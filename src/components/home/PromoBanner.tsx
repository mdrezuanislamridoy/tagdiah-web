import React from 'react';
import { ButtonLink } from '../ui/Button';
import { IMAGES } from '../../data/content';

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-24">
      <div className="relative overflow-hidden">
        <div className="aspect-[4/5] w-full sm:aspect-[21/9]">
          <img
            src={IMAGES.promo}
            alt="A dining nook styled with terracotta tableware, brass candle holders and dried florals"
            className="h-full w-full object-cover"
            loading="lazy" />
          
        </div>
        <div className="absolute inset-0 bg-ink/35 sm:bg-transparent" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center">
          <div className="w-full px-6 sm:w-[46%] sm:px-0 sm:pr-10 lg:ml-auto lg:mr-12">
            <div className="sm:bg-cream/95 sm:p-10 lg:p-12">
              <p className="eyebrow text-gold sm:text-clay">Limited · Ends 30 September</p>
              <h2 className="mt-3 font-display text-3xl font-light leading-tight text-cream sm:text-ink lg:text-[2.75rem]">
                The Monsoon Table, 20% off
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/85 sm:text-smoke">
                Terracotta serveware, brass candle holders and dried florals — a small seasonal
                capsule, made once and not restocked.
              </p>
              <ButtonLink to="/shop/home-accessories" className="mt-8">
                Shop the capsule
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>);

}