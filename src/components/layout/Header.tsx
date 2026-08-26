import React, { useEffect, useState, useMemo, useRef } from 'react';
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
  UserIcon,
} from 'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';
import { cx, formatPrice } from '../../utils/format';

export function Header() {
  const { cartCount, wishlistCount, searchProducts } = useStore();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* Detect scroll for sticky header elevation shadow */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Exactly specified Nav Links: Home, All Products, New Arrivals, Most Rated, About Us, Contact
  const navLinks = useMemo(
    () => [
      { label: 'Home', to: '/' },
      { label: 'All Products', to: '/shop' },
      { label: 'New Arrivals', to: '/shop/new-arrivals' },
      { label: 'Most Rated', to: '/shop/top-rated' },
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
    []
  );

  /* Live search suggestions as user types */
  const liveSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    return searchProducts(query).slice(0, 4);
  }, [query, searchProducts]);

  /* Outside click listener for User Profile Dropdown */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        setUserMenuOpen(false);
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
      <header
        className={cx(
          'w-full border-b border-sand transition-all duration-200 ease-soft',
          scrolled
            ? 'bg-warmwhite/95 backdrop-blur-md shadow-md'
            : 'bg-cream/95 backdrop-blur-sm shadow-none'
        )}
      >
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

          {/* Center: Desktop Navigation (Strictly the 6 requested links) */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/' || link.to === '/shop'}
                className={({ isActive }) =>
                  cx(
                    'relative py-1 text-[12px] uppercase tracking-[0.14em] transition-colors duration-200 ease-soft hover:text-clay',
                    isActive ? 'text-clay font-semibold border-b-2 border-clay' : 'text-ink font-medium'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions (Search, User Profile Dropdown, Wishlist, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              className={iconButton}
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search products"
              aria-expanded={searchOpen}
            >
              <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
            </button>

            {/* Profile Dropdown Menu */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-ink text-cream font-medium text-xs shadow-sm hover:ring-2 hover:ring-gold transition-all"
                  aria-label="User menu"
                  title={user?.name || 'Account'}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-56 rounded-md border border-sand bg-warmwhite shadow-xl py-2 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-sand/70">
                        <p className="text-xs font-semibold text-ink truncate">{user?.name || 'User'}</p>
                        <p className="text-[11px] text-smoke truncate">{user?.email}</p>
                        {user?.role && (
                          <span className="mt-1 inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-sand/60 text-ink rounded">
                            {user.role}
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gold hover:bg-gold/10 transition-colors"
                          >
                            <ShieldIcon className="h-4 w-4" strokeWidth={1.5} />
                            Admin Portal
                          </Link>
                        )}

                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-ink hover:bg-sand/40 transition-colors"
                        >
                          <UserIcon className="h-4 w-4 text-smoke" strokeWidth={1.5} />
                          My Account &amp; Orders
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-ink hover:bg-sand/40 transition-colors"
                        >
                          <HeartIcon className="h-4 w-4 text-smoke" strokeWidth={1.5} />
                          Wishlist ({wishlistCount})
                        </Link>
                      </div>

                      <div className="border-t border-sand/70 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-clay hover:bg-clay/10 transition-colors text-left"
                        >
                          <LogOutIcon className="h-4 w-4" strokeWidth={1.5} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200'}
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