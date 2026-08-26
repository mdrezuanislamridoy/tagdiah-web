import React, { useState } from 'react';
import { CheckIcon, ClockIcon, Loader2Icon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Field, TextArea } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

const channels = [
  {
    icon: PhoneIcon,
    title: 'Call or WhatsApp',
    body: '01332-131386',
    note: 'Saturday to Thursday, 10am – 8pm',
  },
  {
    icon: MailIcon,
    title: 'Email',
    body: 'tagdiah.bd@gmail.com',
    note: 'We reply within one working day',
  },
  {
    icon: MapPinIcon,
    title: 'Visit the studio',
    body: 'Dewgaon, Rajashion, Savar, Dhaka 1340, Bangladesh',
    note: 'Open to walk-ins Saturday to Thursday 10am – 7pm',
  },
];

export function Contact() {
  const { user } = useAuth();
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [topic, setTopic] = useState('A question about a product');
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setState('sending');
    setErrorMsg(null);

    try {
      await api.post('/contact', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        topic,
        message: message.trim(),
      });
      setState('sent');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to deliver message. Please try again or WhatsApp us.');
      setState('idle');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="We answer every message"
        title="Contact us"
        intro="Sizing questions, styling advice, bulk orders for a project — write to us and a person from the studio will reply."
        crumbs={[{ label: 'Contact' }]}
      />

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <ul className="space-y-8">
              {channels.map(({ icon: Icon, title, body, note }) => (
                <li key={title} className="flex gap-4 border-b border-sand pb-8">
                  <Icon className="mt-1 h-4 w-4 shrink-0 text-bark" strokeWidth={1.5} />
                  <div>
                    <p className="eyebrow text-bark">{title}</p>
                    <p className="mt-2 font-display text-xl font-light text-ink">{body}</p>
                    <p className="mt-1.5 text-sm text-smoke">{note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3 text-sm text-smoke">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-bark" strokeWidth={1.5} />
              <p>
                Friday is our slowest day for replies — the studio runs its artisan market then.
              </p>
            </div>
          </div>

          {state === 'sent' ? (
            <div className="flex flex-col items-start justify-center border border-sand bg-warmwhite p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream">
                <CheckIcon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h2 className="mt-6 font-display text-3xl font-light text-ink">Message received</h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-smoke">
                Thank you — someone from the studio will reply to you within one working day. If it
                is urgent, WhatsApp us on 01332-131386.
              </p>
              <Button variant="secondary" className="mt-8" onClick={() => setState('idle')}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-sand bg-warmwhite p-7 lg:p-10">
              <h2 className="font-display text-2xl font-light text-ink">Send us a message</h2>

              {errorMsg && (
                <div className="mt-4 border border-danger/30 bg-danger-tint p-3 text-sm text-danger">
                  {errorMsg}
                </div>
              )}

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Your name"
                  name="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Field
                  label="Phone (optional)"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="sm:col-span-2"
                />
                <div className="flex flex-col sm:col-span-2">
                  <label htmlFor="topic" className="eyebrow mb-2 text-bark">
                    What is this about?
                  </label>
                  <select
                    id="topic"
                    name="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="h-11 border border-dune bg-warmwhite px-3 text-sm text-ink focus:border-ink focus:outline-none"
                  >
                    <option>A question about a product</option>
                    <option>An existing order</option>
                    <option>Interior design consultation</option>
                    <option>Press, partnership or bulk</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <TextArea
                    label="Message"
                    name="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you're looking for, or paste an order number..."
                  />
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <p className="text-xs text-smoke">We never share your email with third parties.</p>
                <Button type="submit" disabled={state === 'sending'}>
                  {state === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <Loader2Icon className="h-4 w-4 animate-spin" /> Sending…
                    </span>
                  ) : (
                    'Send message'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}