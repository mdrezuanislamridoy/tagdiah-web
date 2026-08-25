import React from 'react';
import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboardIcon,
  PackageIcon,
  LayersIcon,
  ShoppingBagIcon,
  UsersIcon,
  StarIcon,
  TicketPercentIcon,
  ImageIcon,
  WarehouseIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  XIcon,
} from 'lucide-react';
import { classNames } from '../../utils/format';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const groups: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboardIcon }],
  },
  {
    heading: 'Catalogue',
    items: [
      { to: '/admin/products', label: 'Products', icon: PackageIcon },
      { to: '/admin/categories', label: 'Categories', icon: LayersIcon },
      { to: '/admin/inventory', label: 'Inventory', icon: WarehouseIcon, badge: '3' },
    ],
  },
  {
    heading: 'Selling',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBagIcon, badge: '12' },
      { to: '/admin/users', label: 'User Management', icon: UsersIcon },
      { to: '/admin/reviews', label: 'Reviews', icon: StarIcon, badge: '2' },
    ],
  },
  {
    heading: 'Marketing',
    items: [
      { to: '/admin/coupons', label: 'Coupons & Discounts', icon: TicketPercentIcon },
      { to: '/admin/banners', label: 'Banners / Promotions', icon: ImageIcon },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { to: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3Icon },
      { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
    ],
  },
];

interface SidebarProps {
  onLogout: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ onLogout, mobileOpen = false, onMobileClose }: SidebarProps) {
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-5 py-5 border-b border-line/60">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-display text-lg text-cream">
            T
          </span>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-medium text-ink">Tagdiah</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-30">Admin Dashboard</p>
          </div>
        </div>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-50 hover:bg-cream hover:text-ink lg:hidden"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <nav className="scroll-thin flex-1 overflow-y-auto px-3 py-4" aria-label="Main">
        {groups.map((group) => (
          <div key={group.heading} className="mb-5">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-30">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/admin'}
                    onClick={onMobileClose}
                    className={({ isActive }) =>
                      classNames(
                        'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors duration-150 ease-out',
                        isActive
                          ? 'bg-cream font-medium text-ink'
                          : 'text-ink-70 hover:bg-cream/60 hover:text-ink'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={classNames(
                            'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-terracotta transition-opacity duration-150',
                            isActive ? 'opacity-100' : 'opacity-0'
                          )}
                        />

                        <item.icon
                          className={classNames(
                            'h-[18px] w-[18px]',
                            isActive ? 'text-brown' : 'text-ink-50'
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <span className="rounded-full bg-terracotta-tint px-1.5 py-0.5 text-[10px] font-semibold text-terracotta">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3 space-y-1">
        <NavLink
          to="/"
          onClick={onMobileClose}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] text-ink-70 transition-colors duration-150 ease-out hover:bg-cream hover:text-ink"
        >
          <ShoppingBagIcon className="h-[18px] w-[18px]" />
          View Storefront
        </NavLink>
        <button
          onClick={() => {
            if (onMobileClose) onMobileClose();
            onLogout();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] text-ink-70 transition-colors duration-150 ease-out hover:bg-danger-tint hover:text-danger"
        >
          <LogOutIcon className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar Aside */}
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Navigation Drawer Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <div className="fixed inset-0 z-[99999] lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-ink/60 backdrop-blur-xs"
                  onClick={onMobileClose}
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="fixed inset-y-0 left-0 z-[100000] flex w-[280px] sm:w-[320px] max-w-[85vw] flex-col bg-surface shadow-2xl border-r border-line"
                >
                  {sidebarContent}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}