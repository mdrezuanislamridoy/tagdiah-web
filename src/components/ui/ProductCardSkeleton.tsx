import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-[4/5] w-full bg-linen" />
      <div className="mt-4 h-2.5 w-20 bg-linen" />
      <div className="mt-3 h-4 w-4/5 bg-linen" />
      <div className="mt-3 h-3 w-24 bg-linen" />
      <div className="mt-4 h-3.5 w-16 bg-linen" />
    </div>);

}