import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { products as defaultProducts } from '../../data/products';

export function NewArrivals() {
  const { products: storeProducts, toggleWishlist, isWishlisted } = useStore();
  const allProducts = storeProducts && storeProducts.length > 0 ? storeProducts : defaultProducts;

  // Get the 5 exact new arrivals
  const arrivals = allProducts
    .filter((p) => p.newArrival || p.id.startsWith('na-'))
    .slice(0, 5);

  return (
    <section className="bg-[#FAF7F2] py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Header: Title on Left, View All on Right */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-[0.06em] text-[#163323] uppercase">
            NEW ARRIVALS
          </h2>
          <Link
            to="/shop/new-arrivals"
            className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#163323] hover:text-[#B08A3E] uppercase transition-colors flex items-center gap-1"
          >
            VIEW ALL <span>→</span>
          </Link>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {arrivals.map((product) => {
            const inWishlist = isWishlisted(product.id);
            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-white rounded-md border border-[#EAE3D4] p-2.5 sm:p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-md hover:border-[#D5C6AF]"
              >
                {/* Image Container with Wishlist Button */}
                <div className="relative aspect-square w-full overflow-hidden rounded-[3px] bg-[#F7F3EC]">
                  <Link to={`/product/${product.slug}`} className="block h-full w-full">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-2 right-2 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/95 shadow-sm transition-transform hover:scale-110 ${
                      inWishlist ? 'text-red-500' : 'text-[#686055] hover:text-red-500'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill={inWishlist ? 'currentColor' : 'none'} strokeWidth={1.75} />
                  </button>
                </div>

                {/* Content */}
                <div className="mt-2.5 flex-1 flex flex-col">
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="text-xs sm:text-[13px] font-medium text-[#22201D] line-clamp-1 hover:text-[#163323] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#163323]">
                      ৳{product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Rating Stars & Count */}
                  <div className="mt-1.5 flex items-center gap-1 text-[#E5A83B]">
                    <div className="flex text-xs">
                      {'★★★★★'}
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-[#736B60]">
                      ({product.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}