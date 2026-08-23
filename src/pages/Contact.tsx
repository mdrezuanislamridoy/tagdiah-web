import React, { useState } from 'react';
import { CheckIcon, ClockIcon, Loader2Icon, MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Field, TextArea } from '../components/ui/Field';
import { Button } from '../components/ui/Button';

const channels = [
{
  icon: PhoneIcon,
  title: 'Call or WhatsApp',
  body: '+880 1712 004 118',
  note: 'Saturday to Thursday, 10am – 8pm'
},
{
  icon: MailIcon,
  title: 'Email',
  body: 'hello@tagdiah.com',
  note: 'We reply within one working day'
},
{
  icon: MapPinIcon,
  title: 'Visit the studio',
  body: 'House 12, Road 27, Banani, Dhaka 1213',
  note: 'Open to walk-ins Friday 11am – 6pm'
}];


export function Contact() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    window.setTimeout(() => setState('sent'), 1000);
  };

  return (
    <>
      <PageHeader
        eyebrow="We answer every message"
        title="Contact us"
        intro="Sizing questions, styling advice, bulk orders for a project — write to us and a person from the studio will reply."
        crumbs={[{ label: 'Contact' }]} />
      

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <ul className="space-y-8">
              {channels.map(({ icon: Icon, title, body, note }) =>
              <li key={title} className="flex gap-4 border-b border-sand pb-8">
                  <Icon className="mt-1 h-4 w-4 shrink-0 text-bark" strokeWidth={1.5} />
                  <div>
                    <p className="eyebrow text-bark">{title}</p>
                    <p className="mt-2 font-display text-xl font-light text-ink">{body}</p>
                    <p className="mt-1.5 text-sm text-smoke">{note}</p>
                  </div>
                </li>
              )}
            </ul>
            <div className="mt-8 flex gap-3 text-sm text-smoke">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-bark" strokeWidth={1.5} />
              <p>
                Friday is our slowest day for replies — the studio runs its artisan market then.
              </p>
            </div>
          </div>

          {state === 'sent' ?
          <div className="flex flex-col items-start justify-center border border-sand bg-warmwhite p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream">
                <CheckIcon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <h2 className="mt-6 font-display text-3xl font-light text-ink">Message received</h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-smoke">
                Thank you — someone from the studio will reply to you within one working day. If it
                is urgent, WhatsApp us on +880 1712 004 118.
              </p>
              <Button variant="secondary" className="mt-8" onClick={() => setState('idle')}>
                Send another message
              </Button>
            </div> :

          <form onSubmit={submit} className="border border-sand bg-warmwhite p-7 lg:p-10">
              <h2 className="font-display text-2xl font-light text-ink">Send us a message</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Your name" name="name" required autoComplete="name" />
                <Field label="Email" name="email" type="email" required autoComplete="email" />
                <Field label="Phone (optional)" name="phone" type="tel" className="sm:col-span-2" />
                <div className="flex flex-col sm:col-span-2">
                  <label htmlFor="topic" className="eyebrow mb-2 text-bark">
                    What is this about?
                  </label>
                  <select
                  id="topic"
                  name="topic"
                  className="h-11 border border-dune bg-warmwhite px-3 text-sm text-ink focus:border-ink focus:outline-none">
                  
                    <option>A question about a product</option>
                    <option>An existing order</option>
                    <option>Styling or sizing advice</option>
                    <option>Bulk or interior project order</option>
                    <option>Something else</option>
                  </select>
                </div>
                <TextArea
                label="Message"
                name="message"
                required
                placeholder="Tell us about your space, your doorway measurements, or your order number."
                className="sm:col-span-2" />
              
              </div>
              <Button type="submit" size="lg" className="mt-8" disabled={state === 'sending'}>
                {state === 'sending' ?
              <>
                    <Loader2Icon className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                    Sending
                  </> :

              'Send message'
              }
              </Button>
            </form>
          }
        </div>
      </div>
    </>);

}