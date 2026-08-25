import React, { useEffect, useState, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  XIcon,
  LogOutIcon,
  LogInIcon,
  ShieldIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { cx, formatPrice } from '../../utils/format';

export function Header() {
  const { cartCount, wishlistCount, categories, searchProducts } = useStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const navLinks = useMemo(() => {
    return [
      { label: 'Shop All', to: '/shop' },
      ...categories.slice(0, 3).map((c) => ({ label: c.name, to: `/shop/${c.slug}` })),
      { label: 'New Arrivals', to: '/shop/new-arrivals' },
      { label: 'About', to: '/about' },
    ];
  }, [categories]);

  /* Live search suggestions as user types */
  const liveSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query).slice(0, 4);
  }, [query, searchProducts]);

  useEffect(() => {
    if (!searchOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen, menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const iconButton =
    'relative flex h-10 w-10 items-center justify-center text-ink transition-colors duration-200 ease-soft hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-sand bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-shell items-center gap-4 px-5 lg:px-8">
        <button
          type="button"
          className={cx(iconButton, 'lg:hidden')}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <Link to="/" className="flex shrink-0 flex-col leading-none lg:w-56">
          <span className="font-display text-[26px] font-medium tracking-[0.22em] text-ink">
            TAGDIAH
          </span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.32em] text-bark">
            Home Décor &amp; Arts
          </span>
        </Link>

        <nav aria-label="Primary" className="mx-auto hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/shop'}
              className={({ isActive }) =>
                cx(
                  'relative py-1 text-[12px] uppercase tracking-[0.14em] transition-colors duration-200 ease-soft hover:text-clay',
                  isActive ? 'text-clay font-medium' : 'text-ink'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:w-56 lg:justify-end">
          <button
            type="button"
            className={iconButton}
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search products"
            aria-expanded={searchOpen}
          >
            <SearchIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {/* Auth buttons */}
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden items-center gap-1.5 border border-gold/40 bg-gold/10 px-2.5 py-1.5 text-[10px] uppercase tracking-widest text-gold transition-colors duration-200 ease-soft hover:bg-gold hover:text-ink sm:inline-flex"
                >
                  <ShieldIcon className="h-3 w-3" strokeWidth={1.5} />
                  Admin
                </Link>
              )}
              <Link
                to="/account"
                className={cx(iconButton, 'hidden sm:flex')}
                aria-label="My Dashboard"
                title="My Dashboard"
              >
                <span className="flex h-7 w-7 items-center justify-center bg-ink text-[10px] font-medium uppercase text-cream">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={cx(iconButton, 'hidden sm:flex')}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOutIcon className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="ml-1 hidden items-center gap-1.5 border border-ink/25 px-4 py-2 text-[11px] uppercase tracking-widest text-ink transition-colors duration-200 ease-soft hover:border-ink hover:bg-ink hover:text-cream sm:inline-flex"
            >
              <LogInIcon className="h-3.5 w-3.5" strokeWidth={1.5} />
              Sign In
            </Link>
          )}

          <Link to="/wishlist" className={iconButton} aria-label={`Wishlist, ${wishlistCount} items`}>
            <HeartIcon className="h-5 w-5" strokeWidth={1.5} />
            {wishlistCount > 0 && <Count value={wishlistCount} />}
          </Link>
          <Link to="/cart" className={iconButton} aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && <Count value={cartCount} />}
          </Link>
        </div>
      </div>

      {/* Search Bar Modal with Live Auto-Suggest */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-sand bg-warmwhite shadow-sm"
          >
            <form onSubmit={submitSearch} className="mx-auto max-w-shell px-5 py-6 lg:px-8">
              <label htmlFor="site-search" className="eyebrow text-smoke">
                Search our handcrafted catalogue
              </label>
              <div className="mt-3 flex items-center gap-3 border-b border-ink/20 pb-3">
                <SearchIcon className="h-5 w-5 text-bark" strokeWidth={1.5} />
                <input
                  id="site-search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type product name, material (linen, brass), or room..."
                  className="w-full bg-transparent font-display text-2xl font-light text-ink placeholder:text-dune focus:outline-none"
                />
                <button
                  type="submit"
                  className="text-[11px] uppercase tracking-widest text-ink hover:text-clay"
                >
                  Search
                </button>
              </div>

              {/* Live search suggestions */}
              {liveSuggestions.length > 0 && (
                <div className="mt-4 border-t border-sand/60 pt-3">
                  <p className="eyebrow text-bark mb-2">Matching Pieces ({liveSuggestions.length})</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {liveSuggestions.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 border border-sand bg-cream/40 p-2.5 hover:border-ink transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 object-cover border border-sand"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-ink">{product.name}</p>
                          <p className="text-[11px] text-clay">{formatPrice(product.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-smoke mr-1 self-center">Popular:</span>
                {['Macramé', 'Door porda', 'Brass', 'Terracotta', 'Cane Lamp', 'Jute Runner'].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/search?q=${encodeURIComponent(term)}`);
                      }}
                      className="border border-sand px-3 py-1 text-xs text-smoke transition-colors duration-200 ease-soft hover:border-ink hover:text-ink"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-ink/50"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              aria-label="Mobile navigation"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="relative flex h-full w-[85%] max-w-sm flex-col bg-warmwhite p-6 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <span className="font-display text-xl font-medium tracking-[0.2em] text-ink">
                  TAGDIAH
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className={iconButton}
                >
                  <XIcon className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Logged in user info */}
              {isAuthenticated && user && (
                <div className="mt-4 border-b border-sand pb-4">
                  <p className="text-xs text-smoke">Logged in as</p>
                  <p className="font-display text-base text-ink font-medium">{user.name}</p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="mt-2 inline-flex items-center gap-1.5 bg-gold/15 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-ink transition-colors"
                    >
                      <ShieldIcon className="h-3 w-3" strokeWidth={1.5} />
                      Admin Portal →
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-sand py-3 font-display text-xl font-light text-ink hover:text-clay"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-6 text-sm text-smoke">
                {isAuthenticated ? (
                  <>
                    <Link to="/account" onClick={() => setMenuOpen(false)} className="text-ink font-medium">
                      My Dashboard &amp; Orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                      Wishlist ({wishlistCount})
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-left text-clay font-medium"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="text-clay font-medium"
                    >
                      Sign In / Create Account
                    </Link>
                    <Link to="/contact" onClick={() => setMenuOpen(false)}>
                      Contact Us
                    </Link>
                    <Link to="/faq" onClick={() => setMenuOpen(false)}>
                      Help &amp; FAQ
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Count({ value }: { value: number }) {
  return (
    <span className="absolute right-1 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-clay px-1 text-[9px] font-medium text-cream">
      {value}
    </span>
  );
}