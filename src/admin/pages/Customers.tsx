import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, EyeIcon, DownloadIcon, MailIcon, UserPlusIcon, SparklesIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput, Select, Field, TextInput } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, Pagination, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { customers as initialCustomers } from '../data/customers';
import type { Customer } from '../types';
import { exportToCSV } from '../utils/exportHelper';
import { bdt, shortDate } from '../utils/format';
import { api } from '../../utils/api';

const PER_PAGE = 8;

interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  city?: string | null;
  address?: string | null;
  status: string;
  createdAt: string;
}

export function Customers() {
  const toast = useToast();
  const [customerList, setCustomerList] = useState<Customer[]>(initialCustomers);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All customers');
  const [sort, setSort] = useState('Highest spend');
  const [page, setPage] = useState(1);

  /* Modal state */
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Dhaka',
    address: '',
    password: '',
  });

  /* ── Load customers from backend ── */
  const fetchCustomers = async () => {
    try {
      const usersData = await api.get<BackendUser[]>('/users');
      if (Array.isArray(usersData)) {
        const customersOnly = usersData
          .filter((u) => u.role === 'Customer')
          .map((u) => ({
            id: u.id,
            name: u.name,
            avatar: u.avatar || `https://i.pravatar.cc/120?u=${encodeURIComponent(u.name)}`,
            email: u.email,
            phone: u.phone || '+880 1700 000 000',
            city: u.city || 'Dhaka',
            address: u.address || undefined,
            orders: 0,
            spent: 0,
            joined: u.createdAt.split('T')[0],
            status: (u.status as 'Active' | 'Blocked' | 'New') || 'Active',
          }));

        if (customersOnly.length > 0) {
          setCustomerList(customersOnly);
        }
      }
    } catch {
      // Keep initial dummy customers on network error
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.email) {
      toast('error', 'Missing details', 'Please provide a name and email address.');
      return;
    }

    const customerPassword = newCustomerForm.password || generatePassword();

    try {
      const created = await api.post<BackendUser>('/users', {
        name: newCustomerForm.name,
        email: newCustomerForm.email,
        phone: newCustomerForm.phone || '+880 1700 000 000',
        city: newCustomerForm.city || 'Dhaka',
        address: newCustomerForm.address || '',
        password: customerPassword,
        role: 'Customer',
      });

      const newCustomer: Customer = {
        id: created.id || `u-${Date.now()}`,
        name: newCustomerForm.name,
        avatar: `https://i.pravatar.cc/120?u=${encodeURIComponent(newCustomerForm.name)}`,
        email: newCustomerForm.email,
        phone: newCustomerForm.phone || '+880 1700 000 000',
        city: newCustomerForm.city || 'Dhaka',
        address: newCustomerForm.address || '',
        orders: 0,
        spent: 0,
        joined: new Date().toISOString().split('T')[0],
        status: 'Active',
      };

      setCustomerList((prev) => [newCustomer, ...prev]);
      setAddCustomerOpen(false);
      setNewCustomerForm({
        name: '',
        email: '',
        phone: '',
        city: 'Dhaka',
        address: '',
        password: '',
      });
      toast(
        'success',
        'Customer Created & Emailed',
        `Account created for ${newCustomer.name}. Login credentials have been sent to ${newCustomer.email} via email.`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create customer.';
      toast('error', 'Creation Failed', message);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = customerList.filter((c) => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
      const matchS = status === 'All customers' || c.status === status;
      return matchQ && matchS;
    });
    return [...list].sort((a, b) =>
      sort === 'Highest spend' ? b.spent - a.spent : sort === 'Most orders' ? b.orders - a.orders : b.joined.localeCompare(a.joined)
    );
  }, [customerList, query, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalSpend = customerList.reduce((s, c) => s + c.spent, 0);

  return (
    <>
      <PageHeader title="Customers" subtitle={`${customerList.length} registered shoppers · ${bdt(totalSpend, true)} lifetime value`}>
        <Button variant="secondary" icon={MailIcon} onClick={() => toast('info', 'Campaign draft created', 'Compose an email to your active customers.')}>
          Email customers
        </Button>
        <Button
          variant="secondary"
          icon={DownloadIcon}
          onClick={() => {
            const headers = ['Customer ID', 'Full Name', 'Email', 'Phone', 'City', 'Address', 'Orders Count', 'Total Spent (BDT)', 'Joined Date', 'Status'];
            const rows = filtered.map((c) => [
              c.id,
              c.name,
              c.email,
              c.phone,
              c.city,
              c.address || '',
              c.orders,
              c.spent,
              c.joined,
              c.status,
            ]);
            exportToCSV('Tagdiah_Customers_Report', headers, rows);
            toast('success', 'Customers Exported', `${filtered.length} customer(s) exported as CSV.`);
          }}
        >
          Export
        </Button>
        <Button icon={UserPlusIcon} onClick={() => setAddCustomerOpen(true)}>
          Add Customer
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search name, email or phone…" className="min-w-[240px] flex-1" />
          <Select label="Customer status" value={status} onChange={setStatus} options={['All customers', 'Active', 'New', 'Blocked']} className="w-[170px]" />
          <Select label="Sort" value={sort} onChange={setSort} options={['Highest spend', 'Most orders', 'Newest first']} className="w-[170px]" />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No customers found"
            description="No one matches this search. Try a different name, email or phone number."
            action={<Button variant="secondary" onClick={() => { setQuery(''); setStatus('All customers'); }}>Clear filters</Button>}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>Contact</Th>
                  <Th>City</Th>
                  <Th>Orders</Th>
                  <Th>Total spent</Th>
                  <Th>Registered</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {view.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <Link to={`/admin/customers/${c.id}`} className="font-medium text-ink hover:text-brown">
                          {c.name}
                        </Link>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-[13px] text-ink">{c.email}</p>
                      <p className="text-[12px] text-ink-50">{c.phone}</p>
                    </Td>
                    <Td>{c.city}</Td>
                    <Td className="text-ink">{c.orders}</Td>
                    <Td className="font-medium text-ink">{bdt(c.spent)}</Td>
                    <Td className="whitespace-nowrap text-[13px]">{shortDate(c.joined)}</Td>
                    <Td>
                      <StatusPill status={c.status} />
                    </Td>
                    <Td>
                      <div className="flex justify-end">
                        <Link
                          to={`/admin/customers/${c.id}`}
                          aria-label={`View ${c.name}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-70 transition-colors duration-150 ease-out hover:bg-cream hover:text-ink"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={page} pages={pages} total={filtered.length} onPage={setPage} />
          </>
        )}
      </Card>

      {/* ── Add Customer Modal ── */}
      <Modal
        open={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
        title="Create Customer Account"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div className="rounded-xl border border-gold/30 bg-gold-tint/40 p-3.5 text-xs text-ink-70 leading-relaxed">
            ✨ <strong className="text-ink">Automated Notification:</strong> When this account is created, Tagdiah will automatically dispatch a welcome email with their generated login credentials via Nodemailer.
          </div>

          <Field label="Full Name" required>
            <TextInput
              required
              placeholder="e.g. Farhana Yasmin"
              value={newCustomerForm.name}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email Address" required>
              <TextInput
                type="email"
                required
                placeholder="customer@example.com"
                value={newCustomerForm.email}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
              />
            </Field>

            <Field label="Phone Number">
              <TextInput
                type="tel"
                placeholder="+880 1712 000 000"
                value={newCustomerForm.phone}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="City">
              <TextInput
                placeholder="e.g. Dhaka"
                value={newCustomerForm.city}
                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
              />
            </Field>

            <Field label="Account Password (Optional)">
              <div className="flex gap-2">
                <TextInput
                  type="text"
                  placeholder="Auto-generated if empty"
                  value={newCustomerForm.password}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setNewCustomerForm({ ...newCustomerForm, password: generatePassword() })}
                  title="Generate Password"
                >
                  <SparklesIcon className="h-4 w-4 text-gold" />
                </Button>
              </div>
            </Field>
          </div>

          <Field label="Delivery Address">
            <TextInput
              placeholder="e.g. House 42, Road 7, Sector 3, Uttara"
              value={newCustomerForm.address}
              onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setAddCustomerOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create &amp; Email Credentials</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}