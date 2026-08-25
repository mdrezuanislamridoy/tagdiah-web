import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  XIcon,
  LogOutIcon,
  ShieldIcon,
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
    const base = [{ label: 'Shop All', to: '/shop' }];
    if (categories && categories.length > 0) {
      categories.slice(0, 4).forEach((c) => {
        base.push({ label: c.name, to: `/shop/${c.slug}` });
      });
    } else {
      base.push(
        { label: 'Wall Art & Canvas', to: '/shop/wall-art' },
        { label: 'Home Accents & Brass', to: '/shop/accents' },
        { label: 'Curtains & Textiles', to: '/shop/textiles' }
      );
    }
    base.push({ label: 'New Arrivals', to: '/shop/new-arrivals' }, { label: 'About Us', to: '/about' });
    return base;
  }, [categories]);

  /* Live search suggestions as user types */
  const liveSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query).slice(0, 4);
  }, [query, searchProducts]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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
    'relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center text-ink transition-colors duration-200 ease-soft hover:text-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink shrink-0';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sand bg-cream/95 backdrop-blur w-full">
        <div className="mx-auto flex h-14 sm:h-16 lg:h-20 max-w-shell items-center justify-between px-3 sm:px-5 lg:px-8">
          {/* Left: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              className={cx(iconButton, 'lg:hidden')}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <Link to="/" className="flex flex-col leading-none min-w-0 truncate">
              <span className="font-display text-base sm:text-lg lg:text-[26px] font-medium tracking-[0.12em] sm:tracking-[0.18em] lg:tracking-[0.22em] text-ink truncate">
                TAGDIAH
              </span>
              <span className="mt-0.5 text-[7px] sm:text-[9px] uppercase tracking-[0.16em] sm:tracking-[0.32em] text-bark truncate">
                Home Décor &amp; Arts
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
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

          {/* Right: Actions (Search, Admin, Account, Wishlist, Cart) */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button
              type="button"
              className={iconButton}
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search products"
              aria-expanded={searchOpen}
            >
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
            </button>

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
                  <LogOutIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="hidden text-[11px] uppercase tracking-widest text-ink transition-colors duration-200 ease-soft hover:text-clay sm:block"
              >
                Sign In
              </Link>
            )}

            <Link to="/wishlist" className={iconButton} aria-label="Wishlist">
              <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              {wishlistCount > 0 && <Count value={wishlistCount} />}
            </Link>

            <Link to="/cart" className={iconButton} aria-label="Shopping cart">
              <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
              {cartCount > 0 && <Count value={cartCount} />}
            </Link>
          </div>
        </div>

        {/* Live Search Modal Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="border-t border-sand bg-warmwhite px-4 py-3 sm:px-5 sm:py-4 shadow-md"
            >
              <form onSubmit={submitSearch} className="mx-auto flex max-w-shell items-center gap-3">
                <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-smoke shrink-0" strokeWidth={1.5} />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search wall art, brass bell, porda, ceramics…"
                  autoFocus
                  className="flex-1 bg-transparent text-xs sm:text-sm text-ink placeholder:text-smoke focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-xs uppercase tracking-widest text-smoke hover:text-ink shrink-0"
                >
                  Close
                </button>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {liveSuggestions.length > 0 && (
                <div className="mx-auto max-w-shell pt-3">
                  <p className="eyebrow text-clay mb-2">Matching Suggestions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {liveSuggestions.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-2 border border-sand bg-cream/40 hover:bg-warmwhite transition-colors"
                      >
                        <img
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          className="h-10 w-10 sm:h-12 sm:w-12 object-cover bg-sand/30"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-ink">{item.name}</p>
                          <p className="text-xs font-mono text-smoke">{formatPrice(item.price)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation Drawer mounted directly via Portal to document.body */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <div className="fixed inset-0 z-[99999] lg:hidden">
                {/* Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-ink/70 backdrop-blur-sm"
                  onClick={() => setMenuOpen(false)}
                />

                {/* Sidebar Navigation Panel */}
                <motion.nav
                  aria-label="Mobile navigation"
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="fixed inset-y-0 left-0 z-[100000] flex w-[280px] sm:w-[320px] max-w-[85vw] flex-col overflow-y-auto bg-[#FAF6F0] p-5 sm:p-6 shadow-2xl border-r border-sand"
                >
                  <div className="flex items-center justify-between border-b border-sand/80 pb-4">
                    <div>
                      <span className="font-display text-lg sm:text-xl font-medium tracking-[0.18em] text-ink block">
                        TAGDIAH
                      </span>
                      <span className="text-[8px] uppercase tracking-[0.24em] text-bark block mt-0.5">
                        Home Décor &amp; Arts
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      aria-label="Close menu"
                      className="flex h-9 w-9 items-center justify-center text-ink hover:text-clay bg-warmwhite border border-sand/60 rounded-md shrink-0"
                    >
                      <XIcon className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                  </div>

                  {/* Logged in user info */}
                  {isAuthenticated && user && (
                    <div className="mt-4 border-b border-sand/80 pb-4">
                      <p className="text-xs text-smoke">Logged in as</p>
                      <p className="font-display text-base text-ink font-semibold">{user.name}</p>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="mt-2 inline-flex items-center gap-1.5 bg-gold/15 border border-gold/30 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-ink transition-colors"
                        >
                          <ShieldIcon className="h-3 w-3" strokeWidth={1.5} />
                          Admin Portal →
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Navigation Links */}
                  <div className="mt-4 flex flex-col divide-y divide-sand/60">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        className="py-3 font-display text-base sm:text-lg font-medium text-ink hover:text-clay transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Secondary Navigation Actions */}
                  <div className="mt-auto flex flex-col gap-3 pt-6 text-sm text-smoke border-t border-sand/80">
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
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

function Count({ value }: { value: number }) {
  return (
    <span className="absolute right-1 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-clay px-1 text-[9px] font-medium text-cream">
      {value}
    </span>
  );
}