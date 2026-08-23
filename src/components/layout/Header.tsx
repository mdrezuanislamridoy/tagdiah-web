import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HeartIcon,
  MenuIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
  XIcon } from
'lucide-react';
import { useStore } from '../../contexts/StoreContext';
import { categories } from '../../data/categories';
import { cx } from '../../utils/format';

const navLinks = [
{ label: 'Shop All', to: '/shop' },
...categories.slice(0, 4).map((c) => ({ label: c.name, to: `/shop/${c.slug}` })),
{ label: 'New Arrivals', to: '/shop/new-arrivals' },
{ label: 'About', to: '/about' }];


export function Header() {
  const { cartCount, wishlist } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-50 border-b border-sand bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-shell items-center gap-4 px-5 lg:px-8">
        <button
          type="button"
          className={cx(iconButton, 'lg:hidden')}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu">
          
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
          {navLinks.map((link) =>
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/shop'}
            className={({ isActive }) =>
            cx(
              'relative py-1 text-[12px] uppercase tracking-[0.14em] transition-colors duration-200 ease-soft hover:text-clay',
              isActive ? 'text-clay' : 'text-ink'
            )
            }>
            
              {link.label}
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:w-56 lg:justify-end">
          <button
            type="button"
            className={iconButton}
            onClick={() => setSearchOpen((v) => !v)}
            aria-label="Search products"
            aria-expanded={searchOpen}>
            
            <SearchIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <Link to="/account" className={cx(iconButton, 'hidden sm:flex')} aria-label="Your account">
            <UserIcon className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link to="/wishlist" className={iconButton} aria-label={`Wishlist, ${wishlist.length} items`}>
            <HeartIcon className="h-5 w-5" strokeWidth={1.5} />
            {wishlist.length > 0 && <Count value={wishlist.length} />}
          </Link>
          <Link to="/cart" className={iconButton} aria-label={`Cart, ${cartCount} items`}>
            <ShoppingBagIcon className="h-5 w-5" strokeWidth={1.5} />
            {cartCount > 0 && <Count value={cartCount} />}
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden border-t border-sand bg-warmwhite">
          
            <form onSubmit={submitSearch} className="mx-auto max-w-shell px-5 py-6 lg:px-8">
              <label htmlFor="site-search" className="eyebrow text-smoke">
                Search the collection
              </label>
              <div className="mt-3 flex items-center gap-3 border-b border-ink/20 pb-3">
                <SearchIcon className="h-5 w-5 text-bark" strokeWidth={1.5} />
                <input
                id="site-search"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try “linen porda” or “brass mirror”"
                className="w-full bg-transparent font-display text-2xl font-light text-ink placeholder:text-dune focus:outline-none" />
              
                <button
                type="submit"
                className="text-[11px] uppercase tracking-widest text-ink hover:text-clay">
                
                  Search
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Macramé', 'Door porda', 'Brass', 'Terracotta', 'Under ৳2,000'].map((term) =>
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  navigate(`/search?q=${encodeURIComponent(term)}`);
                }}
                className="border border-sand px-3 py-1.5 text-xs text-smoke transition-colors duration-200 ease-soft hover:border-ink hover:text-ink">
                
                    {term}
                  </button>
              )}
              </div>
            </form>
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen &&
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
          
            <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setMenuOpen(false)} />
          
            <motion.nav
            aria-label="Mobile"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex h-full w-[82%] max-w-sm flex-col bg-cream px-6 py-6">
            
              <div className="flex items-center justify-between">
                <span className="font-display text-xl tracking-[0.2em] text-ink">TAGDIAH</span>
                <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className={iconButton}>
                
                  <XIcon className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-8 flex flex-col">
                {navLinks.map((link) =>
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="border-b border-sand py-4 font-display text-2xl font-light text-ink">
                
                    {link.label}
                  </Link>
              )}
              </div>
              <div className="mt-auto flex flex-col gap-3 pt-8 text-sm text-smoke">
                <Link to="/account" onClick={() => setMenuOpen(false)}>
                  My account
                </Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>
                  Contact us
                </Link>
                <Link to="/faq" onClick={() => setMenuOpen(false)}>
                  Help &amp; FAQ
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}

function Count({ value }: {value: number;}) {
  return (
    <span className="absolute right-1 top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-clay px-1 text-[9px] font-medium text-cream">
      {value}
    </span>);

}