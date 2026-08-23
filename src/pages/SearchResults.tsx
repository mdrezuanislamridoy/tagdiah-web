import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchXIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/ProductCardSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { products } from '../data/products';
import { categories } from '../data/categories';

export function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((product) =>
    [product.name, product.category, product.shortDescription, ...product.materials, ...product.colors].
    join(' ').
    toLowerCase().
    includes(q)
    );
  }, [query]);

  return (
    <>
      <PageHeader
        eyebrow="Search"
        title={query ? `Results for “${query}”` : 'Search the collection'}
        intro={
        loading ?
        'Looking through the studio…' :
        `${results.length} ${results.length === 1 ? 'piece matches' : 'pieces match'} your search.`
        }
        crumbs={[{ label: 'Search' }]} />
      

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        {loading ?
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {Array.from({ length: 4 }).map((_, i) =>
          <ProductCardSkeleton key={i} />
          )}
          </div> :
        results.length === 0 ?
        <div className="space-y-12">
            <EmptyState
            icon={<SearchXIcon className="h-6 w-6" strokeWidth={1.5} />}
            title="No matches for that search"
            body="Check the spelling, or try a material like “linen”, “brass” or “terracotta”."
            actionLabel="Shop everything"
            actionTo="/shop" />
          
            <div>
              <p className="eyebrow text-bark">Browse instead</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {categories.map((category) =>
              <li key={category.slug}>
                    <Link
                  to={`/shop/${category.slug}`}
                  className="inline-block border border-sand px-4 py-2.5 text-xs text-smoke transition-colors duration-200 ease-soft hover:border-ink hover:text-ink">
                  
                      {category.name}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          </div> :

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            {results.map((product) =>
          <ProductCard key={product.id} product={product} />
          )}
          </div>
        }
      </div>
    </>);

}