import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  MailIcon,
  LockIcon,
  ShieldIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AdminLogin() {
  const { adminLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* redirect if already logged in as admin */
  if (isAuthenticated && isAdmin) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);

      const result = await adminLogin(email, password);
      setIsSubmitting(false);

      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.error || 'Login failed.');
      }
    },
    [email, password, adminLogin, navigate]
  );

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink">
      {/* subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FAF6F0'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* logo & shield */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center border border-cream/20 bg-cream/5">
            <ShieldIcon className="h-7 w-7 text-gold" strokeWidth={1.5} />
          </div>
          <Link to="/" className="inline-block">
            <h2 className="font-display text-3xl font-light tracking-wide text-cream">
              Tagdiah
            </h2>
          </Link>
          <p className="mt-1 text-[9px] uppercase tracking-[0.32em] text-gold">
            Admin Portal
          </p>
        </div>

        {/* card */}
        <div className="border border-cream/10 bg-cream/[0.03] p-8 backdrop-blur-sm">
          <h1 className="font-display text-2xl font-light text-cream">
            Admin Sign In
          </h1>
          <p className="mt-2 text-sm text-cream/50">
            Authorised personnel only. Enter your admin credentials below.
          </p>

          {/* error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                <div className="flex items-center gap-2.5 border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
                  <AlertCircleIcon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="eyebrow mb-2 block text-gold">
                Email Address
              </label>
              <div className="relative">
                <MailIcon
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tagdiah.com"
                  required
                  className="h-12 w-full border border-cream/15 bg-cream/5 pl-11 pr-4 text-sm text-cream placeholder:text-cream/30 transition-colors duration-200 ease-soft focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="eyebrow mb-2 block text-gold">
                Password
              </label>
              <div className="relative">
                <LockIcon
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 w-full border border-cream/15 bg-cream/5 pl-11 pr-12 text-sm text-cream placeholder:text-cream/30 transition-colors duration-200 ease-soft focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream/40 transition-colors hover:text-cream"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <EyeIcon className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* submit */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="group relative mt-2 flex h-14 w-full items-center justify-center gap-3 bg-gold text-[11px] uppercase tracking-widest text-ink transition-colors duration-300 ease-soft hover:bg-cream disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying…
                </span>
              ) : (
                <>
                  Sign In as Admin
                  <ArrowRightIcon
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </>
              )}
            </motion.button>
          </form>

          {/* demo credentials */}
          <div className="mt-6 border border-dashed border-cream/15 bg-cream/[0.03] px-4 py-3 text-xs text-cream/40">
            <p className="font-medium text-gold/70">Demo credentials:</p>
            <p className="mt-1">Email: <span className="text-cream/60">admin@tagdiah.com</span></p>
            <p>Password: <span className="text-cream/60">admin123</span></p>
          </div>
        </div>

        {/* links */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            to="/auth"
            className="text-[11px] uppercase tracking-widest text-cream/40 transition-colors hover:text-cream"
          >
            Customer login →
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-cream/40 transition-colors hover:text-cream"
          >
            <ArrowRightIcon className="h-3 w-3 rotate-180" strokeWidth={1.5} />
            Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}
