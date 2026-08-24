import React, { useState } from 'react';
import { CheckIcon, Loader2Icon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export function Newsletter() {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState('loading');
    window.setTimeout(() => setState('done'), 900);
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
            Subscribe and we will send a ৳500 credit towards your first order over ৳3,000.
          </p>

          {state === 'done' ?
          <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 border border-bark/30 bg-warmwhite px-6 py-5">
              <CheckIcon className="h-5 w-5 text-clay" strokeWidth={1.5} />
              <p className="text-sm text-ink">
                You’re on the list — check your inbox for the credit code.
              </p>
            </div> :

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
              className="h-11 flex-1 border border-dune bg-warmwhite px-4 text-sm text-ink placeholder:text-dune focus:border-ink focus:outline-none" />
            
              <Button type="submit" disabled={state === 'loading'}>
                {state === 'loading' ?
              <>
                    <Loader2Icon className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                    Joining
                  </> :

              'Subscribe'
              }
              </Button>
            </form>
          }
          <p className="mt-4 text-xs text-smoke/70">
            No more than one email a month. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>);
}
