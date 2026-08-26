import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckIcon,
  HeartIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  RotateCcwIcon,
  SearchXIcon,
  ShieldCheckIcon,
  TruckIcon,
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Rating } from '../components/ui/Rating';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductRail } from '../components/product/ProductRail';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { useStore } from '../contexts/StoreContext';
import { availabilityLabel, cx, discountPercent, formatPrice } from '../utils/format';

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const {
    productBySlug,
    productById,
    products: allProducts,
    categoryBySlug,
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const product = slug ? productBySlug(slug) : undefined;

  const colorsList = product?.colors && product.colors.length > 0 ? product.colors : ['Natural'];
  const [color, setColor] = useState(colorsList[0]);
  const [size, setSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const related = useMemo(
    () =>
      product
        ? allProducts
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
        : [],
    [product, allProducts]
  );

  const completeTheLook = useMemo(
    () =>
      (product?.completeTheLook || [])
        .map((id) => productById(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [product, productById]
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-shell px-5 py-24 lg:px-8">
        <EmptyState
          icon={<SearchXIcon className="h-6 w-6" strokeWidth={1.5} />}
          title="We can’t find that piece"
          body="It may have sold out of its limited run, or the link may be out of date."
          actionLabel="Browse the collection"
          actionTo="/shop"
        />
      </div>
    );
  }

  const category = categoryBySlug(product.category);
  const off = discountPercent(product.price, product.compareAt);
  const wished = isWishlisted(product.id);

  const defaultSpecs = [
    { label: 'Origin', value: 'Handcrafted in Bangladesh' },
    { label: 'Materials', value: (product.materials || ['Artisan Blend']).join(', ') },
    { label: 'Care Instructions', value: 'Spot clean gently with damp cloth' },
    { label: 'Lead Time', value: '1–2 business days dispatch' },
  ];

  const specsList = product.specs && product.specs.length > 0 ? product.specs : defaultSpecs;

  const submitAdd = () => {
    addToCart({ productId: product.id, quantity, color, size });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    navigate('/checkout', {
      state: {
        buyNowItem: {
          productId: product.id,
          name: product.name,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
          color,
          size,
          quantity,
          price: product.price,
        },
      },
    });
  };

  return (
    <>
      <div className="mx-auto max-w-shell px-5 pt-8 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            ...(category ? [{ label: category.name, to: `/shop/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="mx-auto max-w-shell px-5 py-10 lg:px-8 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ProductGallery
            images={product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800']}
            name={product.name}
            badge={product.badge}
          />

          <div className="lg:pt-2">
            <p className="eyebrow text-clay">{category?.name || product.category}</p>
            <h1 className="mt-3 font-display text-4xl font-light leading-tight text-ink lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Rating value={product.rating || 4.9} count={product.reviewCount || 12} />
              <a
                href="#reviews"
                className="text-xs text-smoke underline underline-offset-4 hover:text-clay"
              >
                Read reviews
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-4">
              <span className="font-display text-3xl font-light text-ink">
                {formatPrice(product.price)}
              </span>
              {product.compareAt ? (
                <>
                  <span className="text-base text-smoke/70 line-through">
                    {formatPrice(product.compareAt)}
                  </span>
                  <span className="bg-clay px-2.5 py-1 text-[10px] uppercase tracking-widest text-cream">
                    Save {off}%
                  </span>
                </>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-smoke">Inclusive of VAT. Delivery calculated at checkout.</p>

            <p
              className={cx(
                'mt-6 inline-flex items-center gap-2 text-sm',
                product.availability === 'low-stock' ? 'text-clay' : 'text-bark'
              )}
            >
              <span
                className={cx(
                  'h-1.5 w-1.5 rounded-full',
                  product.availability === 'low-stock' ? 'bg-clay' : 'bg-bark'
                )}
                aria-hidden="true"
              />

              {availabilityLabel[product.availability] || 'In stock · Ready for dispatch'}
              {product.availability === 'made-to-order' && ' — ships in 14–21 days'}
            </p>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-smoke">
              {product.shortDescription || product.description}
            </p>

            <fieldset className="mt-9">
              <legend className="eyebrow mb-3 text-bark">Colour — {color}</legend>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setColor(option)}
                    aria-pressed={option === color}
                    className={cx(
                      'border px-4 py-2.5 text-xs transition-colors duration-200 ease-soft',
                      option === color
                        ? 'border-ink bg-ink text-cream'
                        : 'border-sand text-smoke hover:border-ink hover:text-ink'
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            {product.sizes && product.sizes.length > 0 ? (
              <fieldset className="mt-7">
                <legend className="eyebrow mb-3 text-bark">Size</legend>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSize(option)}
                      aria-pressed={option === size}
                      className={cx(
                        'border px-4 py-2.5 text-xs transition-colors duration-200 ease-soft',
                        option === size
                          ? 'border-ink bg-ink text-cream'
                          : 'border-sand text-smoke hover:border-ink hover:text-ink'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center border border-sand">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-full w-11 items-center justify-center text-ink transition-colors duration-200 ease-soft hover:bg-linen"
                >
                  <MinusIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <span className="w-10 text-center text-sm text-ink" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-full w-11 items-center justify-center text-ink transition-colors duration-200 ease-soft hover:bg-linen"
                >
                  <PlusIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>

              <Button onClick={submitAdd} className="min-w-[190px] flex-1">
                {added ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Added to cart
                  </>
                ) : (
                  `Add to cart · ${formatPrice(product.price * quantity)}`
                )}
              </Button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={wished}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                className="flex h-11 w-11 items-center justify-center border border-sand text-ink transition-colors duration-200 ease-soft hover:border-ink"
              >
                <HeartIcon className={cx('h-4 w-4', wished && 'fill-clay text-clay')} strokeWidth={1.5} />
              </button>
            </div>

            <Button variant="secondary" className="mt-3 w-full" onClick={buyNow}>
              Buy it now
            </Button>

            <ul className="mt-9 grid gap-4 border-t border-sand pt-7 sm:grid-cols-2">
              {[
                { icon: TruckIcon, title: 'Free delivery over ৳5,000', body: '1–2 days in Dhaka, 3–5 outside' },
                { icon: RotateCcwIcon, title: '7-day returns', body: 'Free pickup for damaged pieces' },
                { icon: PackageIcon, title: 'Plastic-free packing', body: 'Cloth wrap and recycled board' },
                { icon: ShieldCheckIcon, title: 'Artisan guarantee', body: 'Signed and quality-checked' },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-bark" strokeWidth={1.5} />
                  <div>
                    <p className="text-[13px] text-ink">{title}</p>
                    <p className="mt-0.5 text-xs text-smoke">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="border-y border-sand bg-linen">
        <div className="mx-auto grid max-w-shell gap-12 px-5 py-16 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-20">
          <div>
            <p className="eyebrow text-clay">How it is made</p>
            <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink">
              The story behind this piece
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-smoke">
              {product.story ||
                'Crafted by master artisans using generations-old handloom and carving techniques. Each piece carries subtle organic variations that make it unique to your home.'}
            </p>
          </div>
          <div>
            <p className="eyebrow text-clay">Specifications</p>
            <dl className="mt-5 divide-y divide-dune/60 border-y border-dune/60">
              {specsList.map((spec) => (
                <div key={spec.label} className="flex gap-6 py-4">
                  <dt className="w-40 shrink-0 text-sm text-smoke">{spec.label}</dt>
                  <dd className="text-sm text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {completeTheLook.length > 0 && (
        <section className="mx-auto max-w-shell px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 border border-sand bg-warmwhite p-6 lg:grid-cols-[1fr_1.4fr] lg:items-center lg:gap-12 lg:p-10">
            <div>
              <p className="eyebrow text-clay">Complete the look</p>
              <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink">
                Styled with {product.name.split(' ')[0]}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-smoke">
                Our stylists pair this piece with three others most often. Add the set together and
                we ship it in one box.
              </p>
              <Button
                className="mt-7"
                onClick={() =>
                  completeTheLook.forEach((item) =>
                    addToCart({
                      productId: item.id,
                      quantity: 1,
                      color: item.colors?.[0] || 'Default',
                      size: item.sizes?.[0],
                    })
                  )
                }
              >
                Add all three ·{' '}
                {formatPrice(completeTheLook.reduce((sum, item) => sum + item.price, 0))}
              </Button>
            </div>
            <ul className="grid grid-cols-3 gap-4">
              {completeTheLook.map((item) => (
                <li key={item.id}>
                  <Link to={`/product/${item.slug}`} className="group block">
                    <div className="aspect-square overflow-hidden bg-linen">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800'}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 ease-soft group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-3 text-[13px] leading-snug text-ink group-hover:text-clay">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[13px] text-smoke">{formatPrice(item.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ReviewsSection product={product} />

      <ProductRail
        eyebrow="You may also like"
        title="More from this collection"
        products={related}
        linkTo={category ? `/shop/${category.slug}` : '/shop'}
        linkLabel="View collection"
      />
    </>
  );
}