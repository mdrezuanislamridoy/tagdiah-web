import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  KeyRoundIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'signup' | 'verify' | 'forgot' | 'reset';

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

/* ── OTP Input Component ── */
function OtpInput({ length = 6, value, onChange }: { length?: number; value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const arr = value.split('');
    arr[idx] = char;
    const newVal = arr.join('').slice(0, length);
    onChange(newVal);
    if (char && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const nextIdx = Math.min(pasted.length, length - 1);
    refs.current[nextIdx]?.focus();
  };

  return (
    <div className="flex justify-center gap-2.5">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-14 w-12 border border-dune bg-warmwhite text-center text-xl font-semibold text-ink transition-all duration-200 ease-soft focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
        />
      ))}
    </div>
  );
}

export function Auth() {
  const { login, signup, verifyEmail, resendCode, forgotPassword, resetPassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* form data */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  /* verification state */
  const [verifyUserId, setVerifyUserId] = useState('');
  const [verifyUserEmail, setVerifyUserEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');

  /* forgot/reset state */
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  /* resend timer */
  const [resendTimer, setResendTimer] = useState(0);
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  /* redirect if already logged in */
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
    setError(null);
    setSuccess(null);
  };

  /* ── Login ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.needsVerification && result.userId) {
      setVerifyUserId(result.userId);
      setVerifyUserEmail(result.userEmail || email);
      setOtpCode('');
      setResendTimer(60);
      switchMode('verify');
      return;
    }

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  /* ── Signup ── */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await signup(name, email, password);
    setIsSubmitting(false);

    if (result.success && result.userId) {
      setVerifyUserId(result.userId);
      setVerifyUserEmail(result.userEmail || email);
      setOtpCode('');
      setResendTimer(60);
      switchMode('verify');
    } else {
      setError(result.error || 'Signup failed.');
    }
  };

  /* ── Verify Email ── */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setIsSubmitting(true);
    const result = await verifyEmail(verifyUserId, otpCode);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error || 'Verification failed.');
    }
  };

  /* ── Resend Code ── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setError(null);
    const result = await resendCode(verifyUserEmail);
    if (result.success) {
      setResendTimer(60);
      setSuccess('A new code has been sent to your email.');
      setTimeout(() => setSuccess(null), 4000);
    } else {
      setError(result.error || 'Failed to resend code.');
    }
  };

  /* ── Forgot Password ── */
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await forgotPassword(forgotEmail);
    setIsSubmitting(false);

    if (result.success) {
      setResetCode('');
      setNewPassword('');
      setResendTimer(60);
      switchMode('reset');
      setSuccess('A reset code has been sent to your email.');
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(result.error || 'Failed to send reset code.');
    }
  };

  /* ── Reset Password ── */
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (resetCode.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(forgotEmail, resetCode, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      switchMode('login');
      setSuccess('Password reset successfully! You can now sign in.');
      setTimeout(() => setSuccess(null), 5000);
    } else {
      setError(result.error || 'Password reset failed.');
    }
  };

  /* ── Mode config ── */
  const headings: Record<AuthMode, { title: string; subtitle: string }> = {
    login: { title: 'Welcome back', subtitle: 'Sign in to track orders, save favourites and checkout faster.' },
    signup: { title: 'Join the family', subtitle: 'Create your account and discover our curated collection.' },
    verify: { title: 'Verify your email', subtitle: `We sent a 6-digit code to ${verifyUserEmail}` },
    forgot: { title: 'Forgot password?', subtitle: 'Enter your email and we\'ll send you a reset code.' },
    reset: { title: 'Reset password', subtitle: `Enter the code sent to ${forgotEmail} and your new password.` },
  };

  return (
    <div className="flex min-h-screen w-full bg-cream">
      {/* ─── Left — Lifestyle Image ─── */}
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="/auth-hero.jpg"
          alt="Tagdiah curated living space"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
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
          {/* mode tabs (only show for login/signup) */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="relative mb-10 flex border-b border-sand">
              {(['login', 'signup'] as AuthMode[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => switchMode(tab)}
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
          )}

          {/* back button for verify/forgot/reset */}
          {(mode === 'verify' || mode === 'forgot' || mode === 'reset') && (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-smoke transition-colors hover:text-ink"
            >
              <ArrowLeftIcon className="h-3 w-3" strokeWidth={1.5} />
              Back to sign in
            </button>
          )}

          {/* heading */}
          <AnimatePresence mode="wait">
            <motion.div key={mode} {...fade} transition={{ duration: 0.25 }}>
              <h1 className="font-display text-3xl font-light leading-tight text-ink lg:text-4xl">
                {headings[mode].title}
              </h1>
              <p className="mt-2 text-[15px] text-smoke">
                {headings[mode].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* success message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                <div className="flex items-center gap-2.5 border border-emerald-300/40 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {success}
                </div>
              </motion.div>
            )}
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

          {/* ═══ LOGIN FORM ═══ */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div key="login" {...fade} transition={{ duration: 0.25, delay: 0.05 }} className="space-y-5">
                  <div>
                    <label htmlFor="auth-email" className="eyebrow mb-2 block text-bark">Email Address</label>
                    <div className="relative">
                      <MailIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                      <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-4 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="auth-password" className="eyebrow mb-2 block text-bark">Password</label>
                    <div className="relative">
                      <LockIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                      <input id="auth-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-12 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-smoke transition-colors hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOffIcon className="h-4 w-4" strokeWidth={1.5} /> : <EyeIcon className="h-4 w-4" strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-smoke">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 appearance-none rounded-none border border-dune bg-warmwhite checked:border-ink checked:bg-ink transition-colors duration-150 relative checked:after:content-['✓'] checked:after:text-cream checked:after:text-[10px] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center" />
                      Remember me
                    </label>
                    <button type="button" onClick={() => { setForgotEmail(email); switchMode('forgot'); }}
                      className="text-[11px] uppercase tracking-widest text-clay transition-colors hover:text-ink">
                      Forgot password?
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }}
                className="group relative mt-3 flex h-14 w-full items-center justify-center gap-3 bg-ink text-[11px] uppercase tracking-widest text-cream transition-colors duration-300 ease-soft hover:bg-clay disabled:opacity-50 disabled:pointer-events-none">
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Signing in…
                  </span>
                ) : (
                  <>Sign In<ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} /></>
                )}
              </motion.button>
            </form>
          )}

          {/* ═══ SIGNUP FORM ═══ */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="mt-8 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div key="signup" {...fade} transition={{ duration: 0.25, delay: 0.05 }} className="space-y-5">
                  <div>
                    <label htmlFor="auth-name" className="eyebrow mb-2 block text-bark">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                      <input id="auth-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ayesha Rahman" required
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-4 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="signup-email" className="eyebrow mb-2 block text-bark">Email Address</label>
                    <div className="relative">
                      <MailIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                      <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-4 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="signup-password" className="eyebrow mb-2 block text-bark">Password</label>
                    <div className="relative">
                      <LockIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                      <input id="signup-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-12 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-smoke transition-colors hover:text-ink">
                        {showPassword ? <EyeOffIcon className="h-4 w-4" strokeWidth={1.5} /> : <EyeIcon className="h-4 w-4" strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="signup-confirm" className="eyebrow mb-2 block text-bark">Confirm Password</label>
                    <div className="relative">
                      <LockIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                      <input id="signup-confirm" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                        className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-12 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                      <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-smoke transition-colors hover:text-ink">
                        {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" strokeWidth={1.5} /> : <EyeIcon className="h-4 w-4" strokeWidth={1.5} />}
                      </button>
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-sm text-smoke">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required
                      className="mt-0.5 h-4 w-4 appearance-none rounded-none border border-dune bg-warmwhite checked:border-ink checked:bg-ink transition-colors duration-150 relative checked:after:content-['✓'] checked:after:text-cream checked:after:text-[10px] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center" />
                    <span>
                      I agree to the{' '}
                      <button type="button" className="text-clay underline underline-offset-2">Terms of Service</button>{' '}
                      &amp;{' '}
                      <button type="button" className="text-clay underline underline-offset-2">Privacy Policy</button>
                    </span>
                  </label>
                </motion.div>
              </AnimatePresence>
              <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }}
                className="group relative mt-3 flex h-14 w-full items-center justify-center gap-3 bg-ink text-[11px] uppercase tracking-widest text-cream transition-colors duration-300 ease-soft hover:bg-clay disabled:opacity-50 disabled:pointer-events-none">
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Creating account…
                  </span>
                ) : (
                  <>Create Account<ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} /></>
                )}
              </motion.button>
            </form>
          )}

          {/* ═══ VERIFY EMAIL ═══ */}
          {mode === 'verify' && (
            <form onSubmit={handleVerify} className="mt-8 space-y-6">
              <motion.div {...fade} transition={{ duration: 0.25 }}>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-dune bg-warmwhite">
                  <MailIcon className="h-7 w-7 text-ink" strokeWidth={1.5} />
                </div>
                <OtpInput value={otpCode} onChange={setOtpCode} />
                <div className="mt-6 text-center">
                  <button type="button" onClick={handleResend} disabled={resendTimer > 0}
                    className="text-sm text-smoke transition-colors hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed">
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                  </button>
                </div>
              </motion.div>
              <motion.button type="submit" disabled={isSubmitting || otpCode.length < 6} whileTap={{ scale: 0.98 }}
                className="group flex h-14 w-full items-center justify-center gap-3 bg-ink text-[11px] uppercase tracking-widest text-cream transition-colors duration-300 ease-soft hover:bg-clay disabled:opacity-50 disabled:pointer-events-none">
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Verifying…
                  </span>
                ) : (
                  <>Verify Email<CheckCircle2Icon className="h-3.5 w-3.5" strokeWidth={1.5} /></>
                )}
              </motion.button>
            </form>
          )}

          {/* ═══ FORGOT PASSWORD ═══ */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="mt-8 space-y-5">
              <motion.div {...fade} transition={{ duration: 0.25 }}>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-dune bg-warmwhite">
                  <KeyRoundIcon className="h-7 w-7 text-ink" strokeWidth={1.5} />
                </div>
                <div>
                  <label htmlFor="forgot-email" className="eyebrow mb-2 block text-bark">Email Address</label>
                  <div className="relative">
                    <MailIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                    <input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="your@email.com" required
                      className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-4 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                  </div>
                </div>
              </motion.div>
              <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.98 }}
                className="group flex h-14 w-full items-center justify-center gap-3 bg-ink text-[11px] uppercase tracking-widest text-cream transition-colors duration-300 ease-soft hover:bg-clay disabled:opacity-50 disabled:pointer-events-none">
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Sending…
                  </span>
                ) : (
                  <>Send Reset Code<ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={1.5} /></>
                )}
              </motion.button>
            </form>
          )}

          {/* ═══ RESET PASSWORD ═══ */}
          {mode === 'reset' && (
            <form onSubmit={handleReset} className="mt-8 space-y-5">
              <motion.div {...fade} transition={{ duration: 0.25 }} className="space-y-5">
                <div>
                  <label className="eyebrow mb-3 block text-bark">Reset Code</label>
                  <OtpInput value={resetCode} onChange={setResetCode} />
                  <div className="mt-3 text-center">
                    <button type="button" onClick={async () => { await forgotPassword(forgotEmail); setResendTimer(60); }}
                      disabled={resendTimer > 0}
                      className="text-sm text-smoke transition-colors hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed">
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="new-password" className="eyebrow mb-2 block text-bark">New Password</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune" strokeWidth={1.5} />
                    <input id="new-password" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                      className="h-12 w-full border border-dune bg-warmwhite pl-11 pr-12 text-sm text-ink placeholder:text-dune/60 transition-colors duration-200 ease-soft focus:border-ink focus:outline-none" />
                    <button type="button" onClick={() => setShowNewPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-smoke transition-colors hover:text-ink">
                      {showNewPassword ? <EyeOffIcon className="h-4 w-4" strokeWidth={1.5} /> : <EyeIcon className="h-4 w-4" strokeWidth={1.5} />}
                    </button>
                  </div>
                </div>
              </motion.div>
              <motion.button type="submit" disabled={isSubmitting || resetCode.length < 6} whileTap={{ scale: 0.98 }}
                className="group flex h-14 w-full items-center justify-center gap-3 bg-ink text-[11px] uppercase tracking-widest text-cream transition-colors duration-300 ease-soft hover:bg-clay disabled:opacity-50 disabled:pointer-events-none">
                {isSubmitting ? (
                  <span className="flex items-center gap-3">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Resetting…
                  </span>
                ) : (
                  <>Reset Password<CheckCircle2Icon className="h-3.5 w-3.5" strokeWidth={1.5} /></>
                )}
              </motion.button>
            </form>
          )}

          {/* toggle mode (login/signup only) */}
          {(mode === 'login' || mode === 'signup') && (
            <p className="mt-8 text-center text-sm text-smoke">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                className="font-medium text-ink underline underline-offset-4 decoration-ink/30 transition-colors hover:text-clay hover:decoration-clay">
                {mode === 'login' ? 'Create one' : 'Sign in'}
              </button>
            </p>
          )}

          {/* admin login link */}
          {(mode === 'login' || mode === 'signup') && (
            <div className="mt-4 text-center">
              <Link to="/admin/login" className="text-[11px] uppercase tracking-widest text-smoke transition-colors hover:text-clay">
                Admin login →
              </Link>
            </div>
          )}

          {/* back to shop */}
          <div className="mt-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-smoke transition-colors hover:text-ink">
              <ArrowRightIcon className="h-3 w-3 rotate-180" strokeWidth={1.5} />
              Back to shop
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
