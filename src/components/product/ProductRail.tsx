import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types';

interface ProductRailProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  products: Product[];
  linkTo?: string;
  linkLabel?: string;
  className?: string;
}

export function ProductRail({
  eyebrow,
  title,
  intro,
  products,
  linkTo,
  linkLabel,
  className
}: ProductRailProps) {
  if (products.length === 0) return null;

  return (
    <section className={className}>
      <div className="mx-auto max-w-shell px-5 py-16 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          linkTo={linkTo}
          linkLabel={linkLabel} />
        
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {products.slice(0, 4).map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
        </div>
      </div>
    </section>);

}