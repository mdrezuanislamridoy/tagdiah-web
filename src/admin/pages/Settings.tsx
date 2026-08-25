import React, { useState, useEffect } from 'react';
import {
  StoreIcon,
  PhoneIcon,
  TruckIcon,
  CreditCardIcon,
  PercentIcon,
  BellIcon,
  UserIcon,
  ShieldIcon,
  Loader2Icon,
} from 'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, Select, TextArea, TextInput, Toggle } from '../components/ui/Fields';
import { useToast } from '../components/ui/Toast';
import { classNames } from '../utils/format';
import { api } from '../../utils/api';

const sections = [
  { id: 'store', label: 'Store information', icon: StoreIcon },
  { id: 'contact', label: 'Contact details', icon: PhoneIcon },
  { id: 'delivery', label: 'Delivery & shipping', icon: TruckIcon },
  { id: 'payment', label: 'Payment methods', icon: CreditCardIcon },
  { id: 'tax', label: 'Tax', icon: PercentIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'profile', label: 'Admin profile', icon: UserIcon },
  { id: 'security', label: 'Password & security', icon: ShieldIcon },
] as const;

type SectionId = (typeof sections)[number]['id'];

export function Settings() {
  const toast = useToast();
  const [active, setActive] = useState<SectionId>('delivery');
  const [saving, setSaving] = useState(false);

  /* Delivery Settings State */
  const [deliverySettings, setDeliverySettings] = useState({
    insideDhakaFee: 120,
    outsideDhakaFee: 150,
    freeDeliveryThreshold: 5000,
    defaultCourier: 'Pathao Courier',
    estimatedTime: '2–4 business days',
    options: [
      {
        id: 'standard',
        label: 'Standard Doorstep Delivery',
        body: '3–5 working days across Bangladesh',
        price: 120,
        active: true,
      },
      {
        id: 'express',
        label: 'Express Dhaka Delivery',
        body: 'Guaranteed 24–48 hours in Dhaka metro',
        price: 200,
        active: true,
      },
      {
        id: 'pickup',
        label: 'Studio Collection (Mirpur)',
        body: 'Ready next business day · Free',
        price: 0,
        active: true,
      },
    ],
  });

  /* Fetch live delivery settings */
  useEffect(() => {
    api
      .get<any>('/settings/delivery')
      .then((data) => {
        if (data) {
          setDeliverySettings((prev) => ({
            ...prev,
            ...data,
            options: data.options || prev.options,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const [toggles, setToggles] = useState({
    orderEmail: true,
    lowStock: true,
    reviewAlert: false,
    marketing: true,
    twoFactor: false,
    codEnabled: true,
    bkash: false,
    card: false,
    taxInclusive: true,
  });
  const flip = (k: keyof typeof toggles) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  const saved = async () => {
    setSaving(true);
    try {
      if (active === 'delivery') {
        await api.put('/settings/delivery', {
          insideDhakaFee: Number(deliverySettings.insideDhakaFee),
          outsideDhakaFee: Number(deliverySettings.outsideDhakaFee),
          freeDeliveryThreshold: Number(deliverySettings.freeDeliveryThreshold),
          defaultCourier: deliverySettings.defaultCourier,
          estimatedTime: deliverySettings.estimatedTime,
          options: deliverySettings.options,
        });
      }
      toast('success', 'Settings saved', 'Your changes are live on the storefront checkout.');
    } catch (err: any) {
      toast('error', 'Failed to save', err?.message || 'Server error.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Store Settings & Configuration"
        subtitle="Manage delivery methods, shipping fees, courier partners, and operations."
      >
        <Button variant="secondary">Discard</Button>
        <Button onClick={saved} disabled={saving}>
          {saving ? (
            <span className="flex items-center gap-2">
              <Loader2Icon className="h-4 w-4 animate-spin" /> Saving…
            </span>
          ) : (
            'Save changes'
          )}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <nav className="xl:col-span-3" aria-label="Settings sections">
          <Card className="p-2">
            <ul className="space-y-0.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setActive(s.id)}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors duration-150 ease-out',
                      active === s.id
                        ? 'bg-cream font-medium text-ink'
                        : 'text-ink-70 hover:bg-cream/60 hover:text-ink'
                    )}
                  >
                    <s.icon
                      className={classNames(
                        'h-[18px] w-[18px]',
                        active === s.id ? 'text-brown' : 'text-ink-50'
                      )}
                    />
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </nav>

        <div className="space-y-4 xl:col-span-9">
          {active === 'delivery' ? (
            <Card>
              <CardHeader
                title="Delivery & shipping methods"
                subtitle="Configure shipping fees, delivery options, and free-delivery thresholds"
              />
              <div className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Inside Dhaka standard fee (৳)">
                    <TextInput
                      type="number"
                      value={deliverySettings.insideDhakaFee}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          insideDhakaFee: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                  <Field label="Outside Dhaka standard fee (৳)">
                    <TextInput
                      type="number"
                      value={deliverySettings.outsideDhakaFee}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          outsideDhakaFee: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Free delivery threshold (৳)"
                    hint="Orders equal or above this subtotal get ৳0 delivery charge."
                  >
                    <TextInput
                      type="number"
                      value={deliverySettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setDeliverySettings({
                          ...deliverySettings,
                          freeDeliveryThreshold: Number(e.target.value),
                        })
                      }
                    />
                  </Field>
                  <Field label="Default logistics courier">
                    <Select
                      label="Courier"
                      value={deliverySettings.defaultCourier}
                      onChange={(val) =>
                        setDeliverySettings({ ...deliverySettings, defaultCourier: val })
                      }
                      options={['Pathao Courier', 'Steadfast', 'RedX', 'Sundarban Courier', 'Paperfly']}
                    />
                  </Field>
                </div>

                <Field label="Estimated transit time">
                  <Select
                    label="Estimated delivery time"
                    value={deliverySettings.estimatedTime}
                    onChange={(val) =>
                      setDeliverySettings({ ...deliverySettings, estimatedTime: val })
                    }
                    options={[
                      '1–2 business days',
                      '2–4 business days',
                      '3–5 business days',
                      '4–7 business days',
                    ]}
                  />
                </Field>

                {/* ── Active Delivery Methods Config ── */}
                <div className="border-t border-line pt-4">
                  <p className="text-sm font-semibold text-ink mb-3">Storefront Delivery Options</p>
                  <div className="space-y-3">
                    {deliverySettings.options.map((opt, idx) => (
                      <div
                        key={opt.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-line bg-cream/30 p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-ink">{opt.label}</span>
                            <span className="rounded bg-sand px-1.5 py-0.5 font-mono text-[11px] text-ink">
                              {opt.id}
                            </span>
                          </div>
                          <p className="text-xs text-ink-50 mt-0.5">{opt.body}</p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-ink-50">Price:</span>
                            <TextInput
                              type="number"
                              value={opt.price}
                              onChange={(e) => {
                                const newOpts = [...deliverySettings.options];
                                newOpts[idx] = { ...opt, price: Number(e.target.value) };
                                setDeliverySettings({ ...deliverySettings, options: newOpts });
                              }}
                              className="w-24 text-right font-mono"
                            />
                            <span className="text-xs font-mono text-ink">৳</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {active === 'store' ? (
            <Card>
              <CardHeader title="Store information" subtitle="Shown across the storefront and on invoices" />
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-4 rounded-xl border border-line bg-cream/40 p-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-ink font-display text-xl text-cream">
                    T
                  </span>
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">Store logo</p>
                    <p className="text-[12.5px] text-ink-50">Square PNG or SVG, at least 512×512px.</p>
                  </div>
                  <Button size="sm" variant="secondary" className="ml-auto">
                    Replace
                  </Button>
                </div>
                <Field label="Store name">
                  <TextInput defaultValue="Tagdiah Home Decor & Arts" />
                </Field>
                <Field label="Tagline">
                  <TextInput defaultValue="Handcrafted wall décor, porda and decorative arts" />
                </Field>
                <Field label="Store description">
                  <TextArea
                    rows={4}
                    defaultValue="Tagdiah curates handmade home décor from artisans across Bangladesh — canvas art, embroidered door curtains, ceramics and wood craft, made to warm up everyday spaces."
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Currency">
                    <Select
                      label="Currency"
                      value="BDT (৳)"
                      onChange={() => undefined}
                      options={['BDT (৳)', 'USD ($)']}
                    />
                  </Field>
                  <Field label="Time zone">
                    <Select
                      label="Time zone"
                      value="Asia/Dhaka (GMT+6)"
                      onChange={() => undefined}
                      options={['Asia/Dhaka (GMT+6)', 'Asia/Kolkata (GMT+5:30)']}
                    />
                  </Field>
                </div>
              </div>
            </Card>
          ) : null}

          {active === 'contact' ? (
            <Card>
              <CardHeader title="Contact details" subtitle="Used for customer support and order notifications" />
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Support email">
                    <TextInput type="email" defaultValue="hello@tagdiah.com" />
                  </Field>
                  <Field label="Support hotline">
                    <TextInput defaultValue="+880 1700 000 100" />
                  </Field>
                </div>
                <Field label="WhatsApp number">
                  <TextInput defaultValue="+880 1700 000 101" />
                </Field>
                <Field label="Store address">
                  <TextArea
                    rows={3}
                    defaultValue={
                      'Shop 14, Level 3, Mirpur Ceramic Market\nMirpur 2, Dhaka 1216, Bangladesh'
                    }
                  />
                </Field>
              </div>
            </Card>
          ) : null}

          {active === 'payment' ? (
            <Card>
              <CardHeader title="Payment methods" subtitle="Choose what customers can pay with at checkout" />
              <div className="divide-y divide-line">
                <div className="p-5">
                  <Toggle
                    checked={toggles.codEnabled}
                    onChange={() => flip('codEnabled')}
                    label="Cash on delivery (Active)"
                    description="Collect cash payment when the order is handed over by courier."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={toggles.bkash}
                    onChange={() => flip('bkash')}
                    label="Mobile wallets (bKash, Nagad)"
                    description="Instant payment confirmation via merchant gateway (Coming soon)."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={toggles.card}
                    onChange={() => flip('card')}
                    label="Cards (Visa, Mastercard)"
                    description="Online credit/debit card processing (Coming soon)."
                  />
                </div>
              </div>
            </Card>
          ) : null}

          {active === 'tax' ? (
            <Card>
              <CardHeader title="Tax settings" subtitle="VAT applied to orders at checkout" />
              <div className="space-y-4 p-5">
                <Field label="VAT rate (%)">
                  <TextInput type="number" defaultValue={7.5} />
                </Field>
                <Field label="Business VAT registration number">
                  <TextInput defaultValue="BIN 004312998-0201" />
                </Field>
                <div className="rounded-xl border border-line bg-cream/40 p-4">
                  <Toggle
                    checked={toggles.taxInclusive}
                    onChange={() => flip('taxInclusive')}
                    label="Prices include VAT"
                    description="Show tax-inclusive prices on the storefront."
                  />
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}