import React, { useState } from 'react';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { api } from '../../utils/api';

export function Newsletter() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('TAGDIAH10');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState('loading');
    setErrorMsg(null);

    try {
      const res = await api.post<any>('/contact/newsletter/subscribe', {
        email: email.trim(),
      });
      if (res?.promoCode) {
        setPromoCode(res.promoCode);
      }
      setState('done');
    } catch {
      // Fallback optimistic
      setState('done');
    }
  };

  return (
    <section className="bg-linen">
      <div className="mx-auto max-w-shell px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-clay">The Tagdiah letter</p>
          <h2 className="mt-3 font-display text-3xl font-light leading-tight text-ink sm:text-4xl">
            One letter a month. New pieces, styling notes, and where the work comes from.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-smoke">
            Subscribe and receive a 10% welcome credit code directly to your email inbox.
          </p>

          {state === 'done' ? (
            <div className="mx-auto mt-9 flex max-w-md flex-col items-center justify-center gap-2 border border-bark/30 bg-warmwhite px-6 py-5">
              <div className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-clay" strokeWidth={1.5} />
                <p className="text-sm font-medium text-ink">You’re on the list!</p>
              </div>
              <p className="text-xs text-smoke">
                Use code <span className="font-mono font-bold text-ink">{promoCode}</span> at checkout for 10% off your first order.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 flex-1 border border-dune bg-warmwhite px-4 text-sm text-ink placeholder:text-dune focus:border-ink focus:outline-none"
              />

              <Button type="submit" disabled={state === 'loading'}>
                {state === 'loading' ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2Icon className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                    Joining…
                  </span>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </form>
          )}
          <p className="mt-4 text-xs text-smoke">No spam. Unsubscribe anytime in one click.</p>
        </div>
      </div>
    </section>
  );
}
