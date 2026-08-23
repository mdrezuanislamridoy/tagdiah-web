import React from 'react';
import { Link } from 'react-router-dom';
import { PackageIcon, RotateCcwIcon, TruckIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

const zones = [
{ zone: 'Inside Dhaka', time: '1–2 working days', cost: '৳120 · free over ৳5,000' },
{ zone: 'Outside Dhaka', time: '3–5 working days', cost: '৳180 · free over ৳5,000' },
{ zone: 'Studio pickup — Banani', time: 'Ready in 24 hours', cost: 'Free' },
{ zone: 'International (DHL)', time: '7–12 working days', cost: 'Calculated at checkout' }];


const sections = [
{
  icon: TruckIcon,
  title: 'Shipping',
  paragraphs: [
  'Orders placed before 4pm on a working day are packed and dispatched the same day. You will receive a dispatch note with a courier tracking number as soon as the parcel leaves the studio.',
  'Made-to-order pieces — including the Naqsh embroidered porda and custom-width curtains — are produced after you order and take 14 to 21 days before dispatch. We confirm your measurements by phone before work begins.',
  'Large or fragile items such as carved wall panels and mirrors travel in a double-walled crate with corner protection. Where installation is available in Dhaka, you can add it at checkout.']

},
{
  icon: RotateCcwIcon,
  title: 'Returns',
  paragraphs: [
  'You have seven days from delivery to return an unused piece in its original packaging for a full refund. Start the return from My Orders, or write to hello@tagdiah.com with your order number.',
  'Refunds are issued to the original payment method within five working days of the piece arriving back at the studio. Cash-on-delivery orders are refunded by bKash or bank transfer.',
  'Made-to-order and custom-sized pieces cannot be returned unless they arrive damaged or differ from what was confirmed with you.']

},
{
  icon: PackageIcon,
  title: 'Damaged or wrong items',
  paragraphs: [
  'Photograph the piece and the packaging within 48 hours of delivery and send them to us. We arrange a free courier pickup and either replace the piece or refund you in full — your choice.',
  'Because everything is handmade, small variations in weave density, glaze speckle and wood grain are expected and are not treated as faults. If you are unsure, message us before returning and we will tell you honestly.']

}];


export function ShippingReturns() {
  return (
    <>
      <PageHeader
        eyebrow="Policies"
        title="Shipping & returns"
        intro="How long delivery takes, what it costs, and exactly what happens if something is not right."
        crumbs={[{ label: 'Shipping & Returns' }]} />
      

      <div className="mx-auto max-w-shell px-5 py-12 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_340px] lg:gap-20">
          <div className="space-y-14">
            {sections.map(({ icon: Icon, title, paragraphs }) =>
            <section key={title}>
                <div className="flex items-center gap-3 border-b border-sand pb-4">
                  <Icon className="h-4 w-4 text-bark" strokeWidth={1.5} />
                  <h2 className="font-display text-2xl font-light text-ink lg:text-3xl">{title}</h2>
                </div>
                <div className="mt-6 max-w-2xl space-y-5 text-[15px] leading-relaxed text-smoke">
                  {paragraphs.map((paragraph) =>
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                )}
                </div>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-sand bg-warmwhite p-7">
              <p className="eyebrow text-bark">Delivery at a glance</p>
              <ul className="mt-6 divide-y divide-sand">
                {zones.map((zone) =>
                <li key={zone.zone} className="py-4">
                    <p className="text-sm text-ink">{zone.zone}</p>
                    <p className="mt-1 text-xs text-smoke">{zone.time}</p>
                    <p className="mt-1 text-xs text-bark">{zone.cost}</p>
                  </li>
                )}
              </ul>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-smoke">
              Need something before a particular date?{' '}
              <Link to="/contact" className="text-ink underline underline-offset-4 hover:text-clay">
                Tell us the date
              </Link>{' '}
              and we will confirm whether we can make it.
            </p>
          </aside>
        </div>
      </div>
    </>);

}