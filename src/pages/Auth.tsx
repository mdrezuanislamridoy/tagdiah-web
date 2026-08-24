import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'signup';

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function Auth() {
  const { login, signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* form data */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  /* redirect if already logged in */
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (mode === 'signup' && password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      setIsSubmitting(true);

      if (mode === 'login') {
        const result = await login(email, password);
        setIsSubmitting(false);
        if (result.success) {
          navigate('/', { replace: true });
        } else {
          setError(result.error || 'Login failed.');
        }
      } else {
        const result = await signup(name, email, password);
        setIsSubmitting(false);
        if (result.success) {
          navigate('/', { replace: true });
        } else {
          setError(result.error || 'Signup failed.');
        }
      }
    },
    [mode, email, password, name, confirmPassword, login, signup, navigate]
  );

  return (
    <div className="flex min-h-screen w-full bg-cream">
      {/* ─── Left — Lifestyle Image ─── */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="/auth-hero.jpg"
          alt="Tagdiah curated living space"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />

        {/* brand + tagline */}
        <div className="absolute bottom-0 left-0 right-0 p-12 xl:p-16">
          <Link to="/" className="block">
            <h2 className="font-display text-4xl font-light tracking-wide text-cream xl:text-5xl">
              Tagdiah
            </h2>
          </Link>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-cream/80">
            Handcrafted home décor rooted in tradition, refined for modern living.
            Every piece tells a story.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-light text-cream">2,500+</span>
              <span className="eyebrow mt-1 text-cream/60">Happy Homes</span>
            </div>
            <div className="h-8 w-px bg-cream/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-light text-cream">150+</span>
              <span className="eyebrow mt-1 text-cream/60">Artisan Partners</span>
            </div>
            <div className="h-8 w-px bg-cream/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-light text-cream">4.9★</span>
              <span className="eyebrow mt-1 text-cream/60">Customer Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Right — Auth Form ─── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        {/* mobile logo */}
        <Link to="/" className="mb-10 lg:hidden">
          <h2 className="font-display text-3xl font-light tracking-wide text-ink">Tagdiah</h2>
        </Link>

        <div className="w-full max-w-md">
          {/* mode tabs */}
          <div className="relative mb-10 flex border-b border-sand">
            {(['login', 'signup'] as AuthMode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMode(tab);
                  setShowPassword(false);
                  setShowConfirmPassword(false);
                  setError(null);
                }}
                className={`relative flex-1 pb-4 text-center text-[11px] uppercase tracking-widest transition-colors duration-200 ease-soft ${
                  mode === tab ? 'text-ink' : 'text-smoke hover:text-ink'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
                {mode === tab && (
                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* heading */}
          <AnimatePresence mode="wait">
            <motion.div key={mode} {...fade} transition={{ duration: 0.25 }}>
              <h1 className="font-display text-3xl font-light leading-tight text-ink lg:text-4xl">
                {mode === 'login' ? 'Welcome back' : 'Join the family'}
              </h1>
              <p className="mt-2 text-[15px] text-smoke">
                {mode === 'login'
                  ? 'Sign in to track orders, save favourites and checkout faster.'
                  : 'Create your account and discover our curated collection.'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                <div className="flex items-center gap-2.5 border border-clay/30 bg-clay/5 px-4 py-3 text-sm text-clay">
                  <AlertCircleIcon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                {...fade}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="space-y-5"
              >
                {/* Name (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="auth-name" className="eyebrow mb-2 block text-bark">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon
                        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune"
                        strokeWidth={1.5}
                      />
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ayesha Rahman"
                        required
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-4 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="auth-email" className="eyebrow mb-2 block text-bark">
                    Email Address
                  </label>
                  <div className="relative">
                    <MailIcon
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune"
                      strokeWidth={1.5}
                    />
                    <input
                      id="auth-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-4 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="auth-password" className="eyebrow mb-2 block text-bark">
                    Password
                  </label>
                  <div className="relative">
                    <LockIcon
                      className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune"
                      strokeWidth={1.5}
                    />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-12 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-smoke transition-colors hover:text-ink"
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

                {/* Confirm Password (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="auth-confirm-password" className="eyebrow mb-2 block text-bark">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <LockIcon
                        className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune"
                        strokeWidth={1.5}
                      />
                      <input
                        id="auth-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-12 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-smoke transition-colors hover:text-ink"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <EyeOffIcon className="h-4 w-4" strokeWidth={1.5} />
                        ) : (
                          <EyeIcon className="h-4 w-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember / Forgot (login) OR Terms (signup) */}
                {mode === 'login' ? (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-smoke">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 appearance-none rounded-none border border-dune bg-warmwhite checked:border-ink checked:bg-ink transition-colors duration-150 relative
                          checked:after:content-['✓'] checked:after:text-cream checked:after:text-[10px] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-widest text-clay transition-colors hover:text-ink"
                    >
                      Forgot password?
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm text-smoke">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                      className="mt-0.5 h-4 w-4 appearance-none rounded-none border border-dune bg-warmwhite checked:border-ink checked:bg-ink transition-colors duration-150 relative
                        checked:after:content-['✓'] checked:after:text-cream checked:after:text-[10px] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center"
                    />
                    <span>
                      I agree to the{' '}
                      <button type="button" className="text-clay underline underline-offset-2">
                        Terms of Service
                      </button>{' '}
                      &amp;{' '}
                      <button type="button" className="text-clay underline underline-offset-2">
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                )}
              </motion.div>
            </AnimatePresence>

            {/* submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="group relative mt-3 flex h-14 w-full items-center justify-center gap-3 bg-ink text-[11px] uppercase tracking-widest text-cream transition-colors duration-300 ease-soft hover:bg-clay disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRightIcon
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </>
              )}
            </motion.button>
          </form>

          {/* demo credentials hint */}
          {mode === 'login' && (
            <div className="mt-6 border border-dashed border-dune bg-linen/50 px-4 py-3 text-xs text-smoke">
              <p className="font-medium text-bark">Demo credentials:</p>
              <p className="mt-1">Email: <span className="text-ink">nusrat@example.com</span></p>
              <p>Password: <span className="text-ink">customer123</span></p>
            </div>
          )}

          {/* toggle mode */}
          <p className="mt-8 text-center text-sm text-smoke">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-ink underline underline-offset-4 decoration-ink/30 transition-colors hover:text-clay hover:decoration-clay"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>

          {/* admin login link */}
          <div className="mt-4 text-center">
            <Link
              to="/admin/login"
              className="text-[11px] uppercase tracking-widest text-smoke transition-colors hover:text-clay"
            >
              Admin login →
            </Link>
          </div>

          {/* back to shop */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-smoke transition-colors hover:text-ink"
            >
              <ArrowRightIcon className="h-3 w-3 rotate-180" strokeWidth={1.5} />
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
