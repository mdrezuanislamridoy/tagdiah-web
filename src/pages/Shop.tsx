import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGridIcon, ListIcon, Loader2Icon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { ProductCard } from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/ProductCardSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { FilterPanel, PRICE_CEILING, type Filters } from '../components/shop/FilterPanel';
import { products } from '../data/products';
import { categoryBySlug } from '../data/categories';
import { cx } from '../utils/format';

const SORTS = [
{ value: 'popularity', label: 'Popularity' },
{ value: 'newest', label: 'Newest' },
{ value: 'price-asc', label: 'Price: low to high' },
{ value: 'price-desc', label: 'Price: high to low' },
{ value: 'rating', label: 'Top rated' }] as
const;

const emptyFilters: Filters = {
  categories: [],
  maxPrice: PRICE_CEILING,
  colors: [],
  materials: [],
  inStockOnly: false,
  minRating: 0
};

const PAGE_SIZE = 8;

export function Shop() {
  const { category: routeCategory } = useParams();
  const category = routeCategory ? categoryBySlug(routeCategory) : undefined;

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<(typeof SORTS)[number]['value']>('popularity');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setVisible(PAGE_SIZE);
    setFilters(emptyFilters);
    const timer = window.setTimeout(() => setLoading(false), 550);
    return () => window.clearTimeout(timer);
  }, [routeCategory]);

  const results = useMemo(() => {
    let list = [...products];

    if (routeCategory === 'new-arrivals') list = list.filter((p) => p.newArrival);else
    if (routeCategory) list = list.filter((p) => p.category === routeCategory);

    if (filters.categories.length)
    list = list.filter((p) => filters.categories.includes(p.category));
    list = list.filter((p) => p.price <= filters.maxPrice);
    if (filters.colors.length)
    list = list.filter((p) => p.colors.some((c) => filters.colors.includes(c)));
    if (filters.materials.length)
    list = list.filter((p) => p.materials.some((m) => filters.materials.includes(m)));
    if (filters.inStockOnly) list = list.filter((p) => p.availability !== 'made-to-order');
    if (filters.minRating) list = list.filter((p) => p.rating >= filters.minRating);

    switch (sort) {
      case 'newest':
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => b.popularity - a.popularity);
    }
    return list;
  }, [routeCategory, filters, sort]);

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  const loadMore = () => {
    setLoadingMore(true);
    window.setTimeout(() => {
      setVisible((v) => v + PAGE_SIZE);
      setLoadingMore(false);
    }, 600);
  };

  const activeCount =
  filters.categories.length +
  filters.colors.length +
  filters.materials.length + (
  filters.inStockOnly ? 1 : 0) + (
  filters.minRating ? 1 : 0) + (
  filters.maxPrice < PRICE_CEILING ? 1 : 0);

  return (
    <>
      <PageHeader
        eyebrow={category ? category.tagline : 'The full collection'}
        title={category ? category.name : 'Shop all pieces'}
        intro={
        category ?
        category.description :
        'Every handmade piece we currently have in the studio — wall décor, door porda, accessories and one-off decorative arts.'
        }
        crumbs={[{ label: 'Shop', to: '/shop' }, ...(category ? [{ label: category.name }] : [])]} />
      

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[248px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(emptyFilters)} />
              
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand pb-5">
              <p className="text-sm text-smoke">
                <span className="text-ink">{results.length}</span>{' '}
                {results.length === 1 ? 'piece' : 'pieces'}
                {activeCount > 0 && <span className="ml-2 text-clay">· {activeCount} filters</span>}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="flex h-10 items-center gap-2 border border-dune px-4 text-[11px] uppercase tracking-widest text-ink lg:hidden">
                  
                  <SlidersHorizontalIcon className="h-4 w-4" strokeWidth={1.5} />
                  Filter
                </button>

                <div className="hidden items-center border border-sand sm:flex">
                  <button
                    type="button"
                    onClick={() => setLayout('grid')}
                    aria-label="Grid view"
                    aria-pressed={layout === 'grid'}
                    className={cx(
                      'flex h-10 w-10 items-center justify-center transition-colors duration-200 ease-soft',
                      layout === 'grid' ? 'bg-ink text-cream' : 'text-smoke hover:text-ink'
                    )}>
                    
                    <LayoutGridIcon className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayout('list')}
                    aria-label="List view"
                    aria-pressed={layout === 'list'}
                    className={cx(
                      'flex h-10 w-10 items-center justify-center transition-colors duration-200 ease-soft',
                      layout === 'list' ? 'bg-ink text-cream' : 'text-smoke hover:text-ink'
                    )}>
                    
                    <ListIcon className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>

                <label className="flex items-center gap-2 text-xs text-smoke">
                  <span className="hidden sm:inline">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="h-10 border border-sand bg-warmwhite px-3 text-xs text-ink focus:border-ink focus:outline-none">
                    
                    {SORTS.map((option) =>
                    <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    )}
                  </select>
                </label>
              </div>
            </div>

            {loading ?
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
                {Array.from({ length: 6 }).map((_, i) =>
              <ProductCardSkeleton key={i} />
              )}
              </div> :
            results.length === 0 ?
            <div className="mt-10">
                <EmptyState
                icon={<SlidersHorizontalIcon className="h-6 w-6" strokeWidth={1.5} />}
                title="Nothing matches those filters"
                body="Try widening the price range or clearing a colour — our collection is small and made in limited runs."
                actionLabel="Clear filters"
                onAction={() => setFilters(emptyFilters)} />
              
              </div> :

            <>
                <div
                className={cx(
                  'mt-10',
                  layout === 'grid' ?
                  'grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3 lg:gap-x-8' :
                  'space-y-8'
                )}>
                
                  {shown.map((product) =>
                <ProductCard key={product.id} product={product} layout={layout} />
                )}
                </div>

                <div className="mt-14 flex flex-col items-center gap-4">
                  <p className="text-xs uppercase tracking-widest text-smoke">
                    Showing {shown.length} of {results.length}
                  </p>
                  <div className="h-px w-40 bg-sand">
                    <div
                    className="h-px bg-clay transition-[width] duration-300 ease-soft"
                    style={{ width: `${shown.length / results.length * 100}%` }} />
                  
                  </div>
                  {hasMore &&
                <Button variant="secondary" onClick={loadMore} disabled={loadingMore}>
                      {loadingMore ?
                  <>
                          <Loader2Icon className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                          Loading
                        </> :

                  'Load more'
                  }
                    </Button>
                }
                </div>
              </>
            }
          </div>
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen &&
        <motion.div
          className="fixed inset-0 z-[60] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          
            <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setDrawerOpen(false)} />
          
            <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-cream px-5 pb-24 pt-6">
            
              <div className="mb-6 flex items-center justify-between">
                <span className="eyebrow text-bark">Refine</span>
                <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="flex h-9 w-9 items-center justify-center text-ink">
                
                  <XIcon className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(emptyFilters)} />
            
              <div className="fixed inset-x-0 bottom-0 border-t border-sand bg-cream p-4">
                <Button className="w-full" onClick={() => setDrawerOpen(false)}>
                  Show {results.length} pieces
                </Button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}