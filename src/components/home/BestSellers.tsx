import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { products as defaultProducts } from '../../data/products';
import { formatPrice } from '../../utils/format';

export function BestSellers() {
  const { products: storeProducts, addToCart, toggleWishlist, isWishlisted } = useStore();
  const allProducts = storeProducts && storeProducts.length > 0 ? storeProducts : defaultProducts;

  // Get the 5 exact best seller items
  const bestSellers = allProducts
    .filter((p) => p.bestSeller || p.id.startsWith('bs-'))
    .slice(0, 5);

  return (
    <section className="bg-[#FAF7F2] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        
        {/* Header: Title on Left, View All on Right */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-[0.06em] text-[#163323] uppercase">
            BEST SELLERS
          </h2>
          <Link
            to="/shop"
            className="text-[11px] sm:text-xs font-semibold tracking-wider text-[#163323] hover:text-[#B08A3E] uppercase transition-colors flex items-center gap-1"
          >
            VIEW ALL <span>→</span>
          </Link>
        </div>

        {/* 5-Column Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
          {bestSellers.map((product) => {
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

                  {/* Price Row: current price + compareAt */}
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#163323]">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {product.compareAt && (
                      <span className="text-[10px] sm:text-[11px] text-[#8C8479] line-through">
                        ৳{product.compareAt.toLocaleString()}
                      </span>
                    )}
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

                {/* Add To Cart Button */}
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-[3px] bg-[#123826] py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#0c261a] active:scale-[0.98]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>ADD TO CART</span>
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}