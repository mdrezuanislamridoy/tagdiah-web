import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../product/ProductCard';
import { products } from '../../data/products';

export function BestSellers() {
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4);

  return (
    <section className="border-y border-sand bg-warmwhite">
      <div className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Most ordered this season"
          title="Best sellers"
          intro="The pieces that leave the studio fastest — and come back most often in customer photographs."
          linkTo="/shop"
          linkLabel="All best sellers" />
        
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {bestSellers.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
        </div>
      </div>
    </section>);

}