import React from 'react';
import { ProductCard } from '../product/ProductCard';
import { ButtonLink } from '../ui/Button';
import { products } from '../../data/products';

export function NewArrivals() {
  const arrivals = products.filter((product) => product.newArrival).slice(0, 4);

  return (
    <section className="border-y border-sand bg-linen">
      <div className="mx-auto grid max-w-shell gap-10 px-5 py-20 lg:grid-cols-[300px_1fr] lg:gap-14 lg:px-8 lg:py-28">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-clay">Restocked every fortnight</p>
          <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink lg:text-[2.75rem]">
            New arrivals
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-smoke">
            Four new pieces came off the workbench this month, including our first limited edition
            of the year.
          </p>
          <ButtonLink to="/shop/new-arrivals" variant="secondary" className="mt-7">
            View all new
          </ButtonLink>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:gap-x-10 lg:gap-y-14">
          {arrivals.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
        </div>
      </div>
    </section>);

}