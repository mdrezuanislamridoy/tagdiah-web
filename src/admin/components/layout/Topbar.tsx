import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SearchIcon,
  BellIcon,
  PlusIcon,
  ChevronDownIcon,
  PackagePlusIcon,
  TicketPercentIcon,
  ShoppingBagIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  AlertTriangleIcon,
  StarIcon,
  MailIcon,
  CheckCheckIcon,
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../utils/api';

interface NotificationItem {
  id: string;
  type: 'order' | 'stock' | 'review' | 'message';
  title: string;
  meta: string;
  at: string;
  link: string;
  tone: string;
  read?: boolean;
}

const panel =
  'absolute right-0 top-[calc(100%+8px)] z-40 rounded-xl border border-line bg-surface shadow-pop overflow-hidden';
const motionProps = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] },
};

const READ_KEY = 'tagdiah_read_notification_ids';

export function Topbar({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState<'quick' | 'bell' | 'profile' | null>(null);
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* Load dynamic notifications from backend */
  const loadNotifications = useCallback(() => {
    let locallyReadIds: string[] = [];
    try {
      locallyReadIds = JSON.parse(localStorage.getItem(READ_KEY) || '[]');
    } catch {}

    api
      .get<{ unreadCount?: number; notifications?: NotificationItem[] } | NotificationItem[]>(
        '/notifications'
      )
      .then((res) => {
        let items: NotificationItem[] = [];
        if (Array.isArray(res)) {
          items = res;
        } else if (res?.notifications && Array.isArray(res.notifications)) {
          items = res.notifications;
        }

        if (items.length > 0) {
          const processed = items.map((n) => ({
            ...n,
            read: n.read || locallyReadIds.includes(n.id),
          }));
          setNotifications(processed);
          const unread = processed.filter((n) => !n.read).length;
          setUnreadCount(unread);
        }
      })
      .catch(() => {});
  }, []);

  /* Fast polling for real-time order alerts */
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000); // 3 seconds fast real-time polling

    const handleStorage = () => loadNotifications();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('tagdiah_order_event', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('tagdiah_order_event', handleStorage);
    };
  }, [loadNotifications]);

  /* Outside click listener */
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (to: string) => {
    setOpen(null);
    navigate(to);
  };

  const handleNotificationClick = async (n: NotificationItem) => {
    // 1. Mark as read locally
    try {
      const readIds = JSON.parse(localStorage.getItem(READ_KEY) || '[]');
      if (!readIds.includes(n.id)) {
        readIds.push(n.id);
        localStorage.setItem(READ_KEY, JSON.stringify(readIds));
      }
    } catch {}

    setNotifications((prev) =>
      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    // 2. Call backend to persist read status
    try {
      await api.patch(`/notifications/${n.id}/read`, {});
    } catch {}

    // 3. Navigate
    go(n.link);
  };

  const markAllRead = async () => {
    try {
      const allIds = notifications.map((n) => n.id);
      localStorage.setItem(READ_KEY, JSON.stringify(allIds));
    } catch {}

    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);

    try {
      await api.post('/notifications/read-all', {});
    } catch {}
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return ShoppingBagIcon;
      case 'stock':
        return AlertTriangleIcon;
      case 'review':
        return StarIcon;
      case 'message':
        return MailIcon;
      default:
        return BellIcon;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-md lg:px-6">
      {/* Global Search Bar */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              navigate(`/admin/products?q=${encodeURIComponent(query.trim())}`);
            }
          }}
          placeholder="Search orders, products, customers…"
          aria-label="Global search"
          className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-16 text-sm text-ink placeholder:text-ink-30 focus:border-brown-soft focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brown/15"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line bg-cream px-1.5 py-0.5 text-[10px] font-medium text-ink-50">
          ⌘K
        </kbd>
      </div>

      <div ref={ref} className="ml-auto flex items-center gap-2">
        {/* ── Quick Actions ── */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === 'quick' ? null : 'quick')}
            aria-expanded={open === 'quick'}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-3.5 text-[13px] font-medium text-white transition-colors duration-150 ease-out hover:bg-ink/90"
          >
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Quick action</span>
            <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
          </button>
          <AnimatePresence>
            {open === 'quick' ? (
              <motion.div {...motionProps} className={`${panel} w-56 p-1.5`}>
                {[
                  { label: 'Add Product', icon: PackagePlusIcon, to: '/admin/products/new' },
                  { label: 'View Orders', icon: ShoppingBagIcon, to: '/admin/orders' },
                  { label: 'Create Coupon', icon: TicketPercentIcon, to: '/admin/coupons' },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => go(a.to)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-70 transition-colors duration-150 ease-out hover:bg-cream hover:text-ink"
                  >
                    <a.icon className="h-4 w-4 text-ink-50" />
                    {a.label}
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* ── Dynamic Notifications Bell ── */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === 'bell' ? null : 'bell')}
            aria-label="Notifications"
            aria-expanded={open === 'bell'}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-ink-70 transition-colors duration-150 ease-out hover:bg-cream"
          >
            <BellIcon className="h-[18px] w-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-surface animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <AnimatePresence>
            {open === 'bell' ? (
              <motion.div {...motionProps} className={`${panel} w-84 sm:w-96`}>
                <div className="flex items-center justify-between border-b border-line px-4 py-3 bg-cream/20">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-ink">Notifications</p>
                    {unreadCount > 0 ? (
                      <span className="rounded-full bg-danger-tint border border-danger/30 px-2 py-0.5 text-[11px] font-semibold text-danger">
                        {unreadCount} unread
                      </span>
                    ) : (
                      <span className="rounded-full bg-sage-tint px-2 py-0.5 text-[11px] font-medium text-sage">
                        All read
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11.5px] font-medium text-brown hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <ul className="max-h-84 divide-y divide-line overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="p-8 text-center text-xs text-ink-50">
                      No notifications yet. New orders and alerts will appear here in real-time.
                    </li>
                  ) : (
                    notifications.map((n) => {
                      const IconComp = getIcon(n.type);
                      const isUnread = !n.read;
                      return (
                        <li
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${
                            isUnread ? 'bg-cream/50 hover:bg-cream' : 'hover:bg-cream/30 opacity-75'
                          }`}
                        >
                          <span className="relative mt-0.5">
                            <IconComp className={`h-4 w-4 shrink-0 ${n.tone}`} />
                            {isUnread && (
                              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-terracotta ring-1 ring-surface" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-1">
                              <p
                                className={`truncate text-[13px] ${
                                  isUnread ? 'font-semibold text-ink' : 'font-normal text-ink-70'
                                }`}
                              >
                                {n.title}
                              </p>
                              <span className="text-[10.5px] text-ink-30 shrink-0">{n.at}</span>
                            </div>
                            <p className="truncate text-xs text-ink-50 mt-0.5">{n.meta}</p>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    markAllRead();
                    setOpen(null);
                  }}
                  className="flex w-full items-center justify-center gap-1.5 border-t border-line bg-cream/50 py-2.5 text-[12px] font-medium text-brown hover:bg-cream"
                >
                  <CheckCheckIcon className="h-3.5 w-3.5" />
                  Dismiss & mark all as read
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* ── Dynamic Admin Profile ── */}
        <div className="relative">
          <button
            onClick={() => setOpen(open === 'profile' ? null : 'profile')}
            aria-label="Admin profile"
            aria-expanded={open === 'profile'}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors duration-150 ease-out hover:bg-cream"
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=EAE5DE&color=2B2724`
              }
              alt=""
              className="h-8 w-8 rounded-md object-cover border border-line"
            />

            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[13px] font-medium text-ink">{user?.name || 'Admin'}</span>
              <span className="block text-[11px] text-ink-50">{user?.role || 'Store Admin'}</span>
            </span>
            <ChevronDownIcon className="h-3.5 w-3.5 text-ink-30" />
          </button>
          <AnimatePresence>
            {open === 'profile' ? (
              <motion.div {...motionProps} className={`${panel} w-52 p-1.5`}>
                <div className="border-b border-line px-3 py-2 sm:hidden">
                  <p className="text-[13px] font-medium text-ink">{user?.name}</p>
                  <p className="text-[11px] text-ink-50">{user?.email}</p>
                </div>
                <button
                  onClick={() => go('/admin/users')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-70 hover:bg-cream hover:text-ink"
                >
                  <UserIcon className="h-4 w-4 text-ink-50" /> Admin profile
                </button>
                <button
                  onClick={() => go('/admin/settings')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-70 hover:bg-cream hover:text-ink"
                >
                  <SettingsIcon className="h-4 w-4 text-ink-50" /> Store settings
                </button>
                <button
                  onClick={() => go('/')}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-70 hover:bg-cream hover:text-ink"
                >
                  <ShoppingBagIcon className="h-4 w-4 text-ink-50" /> View storefront
                </button>
                <div className="my-1 h-px bg-line" />
                <button
                  onClick={() => {
                    setOpen(null);
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-danger hover:bg-danger-tint"
                >
                  <LogOutIcon className="h-4 w-4" /> Logout
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}