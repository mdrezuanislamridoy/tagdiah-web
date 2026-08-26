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
import { useStore } from '../../contexts/StoreContext';
import { useAuth } from '../../contexts/AuthContext';

const sections = [
  { id: 'store', label: 'Store information', icon: StoreIcon },
  { id: 'contact', label: 'Contact details', icon: PhoneIcon },
  { id: 'delivery', label: 'Delivery & shipping', icon: TruckIcon },
  { id: 'payment', label: 'Payment methods', icon: CreditCardIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
  { id: 'profile', label: 'Admin profile', icon: UserIcon },
  { id: 'security', label: 'Password & security', icon: ShieldIcon },
] as const;

type SectionId = (typeof sections)[number]['id'];

export function Settings() {
  const toast = useToast();
  const { refreshDeliverySettings } = useStore();
  const { user } = useAuth();
  const [active, setActive] = useState<SectionId>('delivery');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ── 1. Dynamic Store Information ── */
  const [storeSettings, setStoreSettings] = useState({
    name: 'Tagdiah Home Decor & Arts',
    tagline: 'Handcrafted wall décor, porda and decorative arts',
    description:
      'Tagdiah curates handmade home décor from artisans across Bangladesh — canvas art, embroidered door curtains, ceramics and wood craft, made to warm up everyday spaces.',
    currency: 'BDT (৳)',
    timeZone: 'Asia/Dhaka (GMT+6)',
  });

  /* ── 2. Dynamic Contact Details ── */
  const [contactSettings, setContactSettings] = useState({
    supportEmail: 'tagdiah.bd@gmail.com',
    supportHotline: '01332-131386',
    whatsappNumber: '01332-131386',
    storeAddress: 'Dewgaon, Rajashion, Savar, Dhaka 1340, Bangladesh',
  });

  /* ── 3. Dynamic Delivery Settings ── */
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
        label: 'Studio Collection (Savar)',
        body: 'Ready next business day · Free',
        price: 0,
        active: true,
      },
    ],
  });

  /* ── 4. Dynamic Payment Settings ── */
  const [paymentSettings, setPaymentSettings] = useState({
    codEnabled: true,
    bkash: false,
    card: false,
    allowDiscounts: true,
  });

  /* ── 6. Dynamic Notification Settings ── */
  const [notificationSettings, setNotificationSettings] = useState({
    orderEmail: true,
    lowStock: true,
    reviewAlert: false,
    marketing: true,
  });

  /* ── 7. Dynamic Admin Profile ── */
  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || 'Super Admin',
    email: user?.email || 'admin@tagdiah.com',
    phone: user?.phone || '01332-131386',
    department: user?.department || 'Store Operations',
    bio: 'Lead Store Operations Manager at Tagdiah Home Décor & Arts.',
  });

  /* ── 8. Dynamic Password & Security ── */
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
  });

  /* Fetch all dynamic settings from backend */
  useEffect(() => {
    setLoading(true);
    api
      .get<any>('/settings/all')
      .then((data) => {
        if (data) {
          if (data.store) setStoreSettings((prev) => ({ ...prev, ...data.store }));
          if (data.contact) setContactSettings((prev) => ({ ...prev, ...data.contact }));
          if (data.delivery)
            setDeliverySettings((prev) => ({
              ...prev,
              ...data.delivery,
              options: data.delivery.options || prev.options,
            }));
          if (data.payment) setPaymentSettings((prev) => ({ ...prev, ...data.payment }));
          if (data.notifications)
            setNotificationSettings((prev) => ({ ...prev, ...data.notifications }));
          if (data.security) setSecuritySettings((prev) => ({ ...prev, ...data.security }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Synchronize User Profile if logged-in user loads */
  useEffect(() => {
    if (user) {
      setProfileSettings((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        department: user.department || prev.department,
      }));
    }
  }, [user]);

  /* Save Active Section Settings */
  const saved = async () => {
    setSaving(true);
    try {
      let activePayload: any = {};
      if (active === 'store') activePayload = storeSettings;
      else if (active === 'contact') activePayload = contactSettings;
      else if (active === 'delivery') activePayload = deliverySettings;
      else if (active === 'payment') activePayload = paymentSettings;
      else if (active === 'notifications') activePayload = notificationSettings;
      else if (active === 'profile') activePayload = profileSettings;
      else if (active === 'security') activePayload = securitySettings;

      await api.put(`/settings/${active}`, activePayload);

      if (active === 'delivery') {
        await refreshDeliverySettings();
      }

      toast(
        'success',
        'Settings Saved',
        `Your ${sections.find((s) => s.id === active)?.label || 'store'} changes are now saved and live.`
      );
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
        subtitle="Manage store details, contact channels, delivery methods, payment rules, and profile."
      >
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Discard
        </Button>
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
          {/* 1. STORE INFORMATION */}
          {active === 'store' ? (
            <Card>
              <CardHeader title="Store information" subtitle="Shown across the storefront and on customer invoices" />
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
                  <TextInput
                    value={storeSettings.name}
                    onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                  />
                </Field>
                <Field label="Tagline">
                  <TextInput
                    value={storeSettings.tagline}
                    onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                  />
                </Field>
                <Field label="Store description">
                  <TextArea
                    rows={4}
                    value={storeSettings.description}
                    onChange={(e) => setStoreSettings({ ...storeSettings, description: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Currency">
                    <Select
                      label="Currency"
                      value={storeSettings.currency}
                      onChange={(val) => setStoreSettings({ ...storeSettings, currency: val })}
                      options={['BDT (৳)', 'USD ($)']}
                    />
                  </Field>
                  <Field label="Time zone">
                    <Select
                      label="Time zone"
                      value={storeSettings.timeZone}
                      onChange={(val) => setStoreSettings({ ...storeSettings, timeZone: val })}
                      options={['Asia/Dhaka (GMT+6)', 'Asia/Kolkata (GMT+5:30)']}
                    />
                  </Field>
                </div>
              </div>
            </Card>
          ) : null}

          {/* 2. CONTACT DETAILS */}
          {active === 'contact' ? (
            <Card>
              <CardHeader title="Contact details" subtitle="Used for customer support and order notifications" />
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Support email">
                    <TextInput
                      type="email"
                      value={contactSettings.supportEmail}
                      onChange={(e) => setContactSettings({ ...contactSettings, supportEmail: e.target.value })}
                    />
                  </Field>
                  <Field label="Support hotline">
                    <TextInput
                      value={contactSettings.supportHotline}
                      onChange={(e) => setContactSettings({ ...contactSettings, supportHotline: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="WhatsApp number">
                  <TextInput
                    value={contactSettings.whatsappNumber}
                    onChange={(e) => setContactSettings({ ...contactSettings, whatsappNumber: e.target.value })}
                  />
                </Field>
                <Field label="Store address">
                  <TextArea
                    rows={3}
                    value={contactSettings.storeAddress}
                    onChange={(e) => setContactSettings({ ...contactSettings, storeAddress: e.target.value })}
                  />
                </Field>
              </div>
            </Card>
          ) : null}

          {/* 3. DELIVERY & SHIPPING */}
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
                      onChange={(e) => {
                        const fee = Number(e.target.value);
                        const updatedOptions = deliverySettings.options.map((o) =>
                          o.id === 'standard' ? { ...o, price: fee } : o
                        );
                        setDeliverySettings({
                          ...deliverySettings,
                          insideDhakaFee: fee,
                          options: updatedOptions,
                        });
                      }}
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

          {/* 4. PAYMENT METHODS & PROMOTIONS */}
          {active === 'payment' ? (
            <Card>
              <CardHeader title="Payment methods & Promotions" subtitle="Configure payment gateways and promo discount settings" />
              <div className="divide-y divide-line">
                <div className="p-5">
                  <Toggle
                    checked={paymentSettings.allowDiscounts}
                    onChange={() =>
                      setPaymentSettings({ ...paymentSettings, allowDiscounts: !paymentSettings.allowDiscounts })
                    }
                    label="Enable Promo Coupons & Order Discounts"
                    description="Allow customers to enter discount codes and redeem promo coupons at storefront checkout."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={paymentSettings.codEnabled}
                    onChange={() => setPaymentSettings({ ...paymentSettings, codEnabled: !paymentSettings.codEnabled })}
                    label="Cash on delivery (Active)"
                    description="Collect cash payment when the order is handed over by courier."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={paymentSettings.bkash}
                    onChange={() => setPaymentSettings({ ...paymentSettings, bkash: !paymentSettings.bkash })}
                    label="Mobile wallets (bKash, Nagad)"
                    description="Instant payment confirmation via merchant gateway."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={paymentSettings.card}
                    onChange={() => setPaymentSettings({ ...paymentSettings, card: !paymentSettings.card })}
                    label="Cards (Visa, Mastercard)"
                    description="Online credit/debit card processing."
                  />
                </div>
              </div>
            </Card>
          ) : null}

          {/* 6. NOTIFICATION PREFERENCES */}
          {active === 'notifications' ? (
            <Card>
              <CardHeader
                title="Notification preferences"
                subtitle="Manage how and when you receive store alerts and order notifications"
              />
              <div className="divide-y divide-line">
                <div className="p-5">
                  <Toggle
                    checked={notificationSettings.orderEmail}
                    onChange={() =>
                      setNotificationSettings({ ...notificationSettings, orderEmail: !notificationSettings.orderEmail })
                    }
                    label="New order notifications"
                    description="Receive instant email alerts whenever a customer places a new order."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={notificationSettings.lowStock}
                    onChange={() =>
                      setNotificationSettings({ ...notificationSettings, lowStock: !notificationSettings.lowStock })
                    }
                    label="Low stock alerts"
                    description="Get notified when product inventory drops below threshold (5 units)."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={notificationSettings.reviewAlert}
                    onChange={() =>
                      setNotificationSettings({ ...notificationSettings, reviewAlert: !notificationSettings.reviewAlert })
                    }
                    label="New review alerts"
                    description="Receive notifications when customers submit product reviews."
                  />
                </div>
                <div className="p-5">
                  <Toggle
                    checked={notificationSettings.marketing}
                    onChange={() =>
                      setNotificationSettings({ ...notificationSettings, marketing: !notificationSettings.marketing })
                    }
                    label="Weekly sales summary report"
                    description="Receive a weekly summary email with revenue, top products, and customer stats."
                  />
                </div>
              </div>
            </Card>
          ) : null}

          {/* 7. ADMIN PROFILE */}
          {active === 'profile' ? (
            <Card>
              <CardHeader
                title="Admin profile settings"
                subtitle="Update your personal account details and administrator profile"
              />
              <div className="space-y-5 p-5">
                <div className="flex items-center gap-4 rounded-xl border border-line bg-cream/40 p-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-2xl uppercase text-cream">
                    {profileSettings.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{profileSettings.name}</p>
                    <p className="text-xs text-ink-50">{profileSettings.email}</p>
                    <span className="mt-1 inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 bg-sand/60 text-ink font-medium rounded">
                      {user?.role || 'Super Admin'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full name">
                    <TextInput
                      value={profileSettings.name}
                      onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                    />
                  </Field>
                  <Field label="Email address">
                    <TextInput
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Phone number">
                    <TextInput
                      value={profileSettings.phone}
                      onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                    />
                  </Field>
                  <Field label="Department / Role">
                    <TextInput
                      value={profileSettings.department}
                      onChange={(e) => setProfileSettings({ ...profileSettings, department: e.target.value })}
                    />
                  </Field>
                </div>

                <Field label="Bio / Notes">
                  <TextArea
                    rows={3}
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })}
                  />
                </Field>
              </div>
            </Card>
          ) : null}

          {/* 8. PASSWORD & SECURITY */}
          {active === 'security' ? (
            <Card>
              <CardHeader
                title="Password & Security"
                subtitle="Manage account authentication, password, and security policies"
              />
              <div className="space-y-5 p-5">
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-ink">Change Password</p>
                  <Field label="Current password">
                    <TextInput
                      type="password"
                      value={securitySettings.currentPassword}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
                      placeholder="••••••••"
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="New password">
                      <TextInput
                        type="password"
                        value={securitySettings.newPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </Field>
                    <Field label="Confirm new password">
                      <TextInput
                        type="password"
                        value={securitySettings.confirmPassword}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                    </Field>
                  </div>
                </div>

                <div className="border-t border-line pt-5">
                  <p className="text-sm font-semibold text-ink mb-3">Two-Factor Authentication (2FA)</p>
                  <div className="rounded-xl border border-line bg-cream/40 p-4">
                    <Toggle
                      checked={securitySettings.twoFactor}
                      onChange={() => setSecuritySettings({ ...securitySettings, twoFactor: !securitySettings.twoFactor })}
                      label="Enable Two-Factor Authentication"
                      description="Require a verification code sent to your phone/email when signing into Admin Portal."
                    />
                  </div>
                </div>

                <div className="border-t border-line pt-5">
                  <p className="text-sm font-semibold text-ink mb-1">Active Sessions</p>
                  <p className="text-xs text-ink-50 mb-3">Devices currently logged into this admin account</p>
                  <div className="rounded-xl border border-line bg-warmwhite p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-ink">Chrome on Windows (Current Session)</p>
                      <p className="text-ink-50">Dhaka, Bangladesh · Active now</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sand/60 text-ink font-semibold rounded">
                      This Device
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}