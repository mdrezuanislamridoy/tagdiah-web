import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserPlusIcon,
  ShieldCheckIcon,
  UsersIcon,
  UserCheckIcon,
  ShieldAlertIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  MoreVerticalIcon,
  KeyIcon,
  LockIcon,
  UnlockIcon,
  Trash2Icon,
  EditIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  XCircleIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  EyeIcon,
  RefreshCwIcon,
  SparklesIcon,
} from 'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextInput, Toggle } from '../components/ui/Fields';
import { TableShell, Th, Td, Tr, Pagination } from '../components/ui/Table';
import { StatusPill } from '../components/ui/StatusPill';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { customers as initialCustomers } from '../data/customers';
import { initialStaffUsers, initialRoles, initialAuditLogs } from '../data/users';
import type { StaffUser, RoleDefinition, UserAuditLog, Customer, StaffRole } from '../types';
import { bdt, shortDate, classNames } from '../utils/format';
import { api } from '../../utils/api';

const tabs = [
  { id: 'team', label: 'Team & Staff', icon: ShieldCheckIcon },
  { id: 'customers', label: 'Customer Directory', icon: UsersIcon },
  { id: 'roles', label: 'Roles & Permissions', icon: KeyIcon },
  { id: 'audit', label: 'Security & Audit Logs', icon: ClockIcon },
] as const;

type TabId = (typeof tabs)[number]['id'];

interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  department?: string | null;
  city?: string | null;
  address?: string | null;
  status: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastLogin?: string | null;
  createdAt: string;
}

interface BackendAuditLog {
  id: string;
  actorName: string;
  actorEmail: string;
  action: string;
  target?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  status: string;
  createdAt: string;
}

export function UserManagement() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<TabId>('team');

  /* ── State ── */
  const [staffList, setStaffList] = useState<StaffUser[]>(initialStaffUsers);
  const [customerList, setCustomerList] = useState<Customer[]>(initialCustomers);
  const [rolesList, setRolesList] = useState<RoleDefinition[]>(initialRoles);
  const [auditLogs, setAuditLogs] = useState<UserAuditLog[]>(initialAuditLogs);
  const [loading, setLoading] = useState(false);

  /* Filter states */
  const [staffSearch, setStaffSearch] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('All roles');
  const [staffStatusFilter, setStaffStatusFilter] = useState('All statuses');

  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('All statuses');

  const [auditSearch, setAuditSearch] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState('All');

  /* Modals */
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [editStaffUser, setEditStaffUser] = useState<StaffUser | null>(null);
  const [deleteStaffUser, setDeleteStaffUser] = useState<StaffUser | null>(null);
  const [customerToBlock, setCustomerToBlock] = useState<Customer | null>(null);

  /* Form for new staff */
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Store Manager' as StaffRole,
    department: 'Operations',
    twoFactor: true,
  });

  /* Form for new customer */
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Dhaka',
    address: '',
    password: '',
  });

  /* ── Load Users from Backend ── */
  const fetchUsersAndLogs = async () => {
    setLoading(true);
    try {
      const usersData = await api.get<BackendUser[]>('/users');
      if (Array.isArray(usersData) && usersData.length > 0) {
        const staff: StaffUser[] = [];
        const customers: Customer[] = [];

        usersData.forEach((u) => {
          if (u.role === 'Customer') {
            customers.push({
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
            });
          } else {
            staff.push({
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone || '+880 1700 000 000',
              avatar: u.avatar || `https://i.pravatar.cc/120?u=${encodeURIComponent(u.name)}`,
              role: (u.role as StaffRole) || 'Store Admin',
              department: u.department || 'Operations',
              status: (u.status as 'Active' | 'Inactive' | 'Suspended') || 'Active',
              twoFactorEnabled: !!u.twoFactorEnabled,
              lastLogin: u.lastLogin ? shortDate(u.lastLogin) : 'Never',
              joined: u.createdAt.split('T')[0],
              permissions: ['products', 'orders'],
            });
          }
        });

        if (staff.length > 0) setStaffList(staff);
        if (customers.length > 0) setCustomerList(customers);
      }
    } catch {
      // Keep initial dummy data on error
    }

    try {
      const logsData = await api.get<BackendAuditLog[]>('/users/audit-logs');
      if (Array.isArray(logsData) && logsData.length > 0) {
        setAuditLogs(
          logsData.map((l) => ({
            id: l.id,
            timestamp: shortDate(l.createdAt),
            actorName: l.actorName,
            actorEmail: l.actorEmail,
            action: l.action,
            targetUser: l.target || 'System',
            details: l.details || '',
            ipAddress: l.ipAddress || '103.145.72.18 (Dhaka, BD)',
            status: (l.status as 'Success' | 'Warning' | 'Failed') || 'Success',
          }))
        );
      }
    } catch {
      // Keep initial dummy logs
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsersAndLogs();
  }, []);

  /* ── Metric calculations ── */
  const totalUsers = staffList.length + customerList.length;
  const activeStaffCount = staffList.filter((s) => s.status === 'Active').length;
  const activeCustomersCount = customerList.filter((c) => c.status === 'Active').length;
  const suspendedCount =
    staffList.filter((s) => s.status === 'Suspended').length +
    customerList.filter((c) => c.status === 'Blocked').length;

  /* ── Filtered Staff ── */
  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.phone.includes(staffSearch);
      const matchRole = staffRoleFilter === 'All roles' || s.role === staffRoleFilter;
      const matchStatus = staffStatusFilter === 'All statuses' || s.status === staffStatusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [staffList, staffSearch, staffRoleFilter, staffStatusFilter]);

  /* ── Filtered Customers ── */
  const filteredCustomers = useMemo(() => {
    return customerList.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.includes(customerSearch) ||
        c.city.toLowerCase().includes(customerSearch.toLowerCase());
      const matchStatus = customerStatusFilter === 'All statuses' || c.status === customerStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [customerList, customerSearch, customerStatusFilter]);

  /* ── Filtered Audit Logs ── */
  const filteredAudit = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchSearch =
        log.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.targetUser.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.details.toLowerCase().includes(auditSearch.toLowerCase());
      const matchStatus = auditStatusFilter === 'All' || log.status === auditStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [auditLogs, auditSearch, auditStatusFilter]);

  /* ── Helper to generate a random secure password ── */
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  /* ── Handlers ── */
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name || !newStaffForm.email) {
      toast('error', 'Missing details', 'Please provide at least a full name and email address.');
      return;
    }

    const tempPassword = newStaffForm.password || generatePassword();

    try {
      const created = await api.post<BackendUser>('/users', {
        name: newStaffForm.name,
        email: newStaffForm.email,
        phone: newStaffForm.phone || '+880 1700 000 000',
        role: newStaffForm.role,
        department: newStaffForm.department,
        twoFactorEnabled: newStaffForm.twoFactor,
        password: tempPassword,
      });

      const newStaff: StaffUser = {
        id: created.id || `st-${Date.now()}`,
        name: newStaffForm.name,
        email: newStaffForm.email,
        phone: newStaffForm.phone || '+880 1700 000 000',
        avatar: `https://i.pravatar.cc/120?u=${encodeURIComponent(newStaffForm.name)}`,
        role: newStaffForm.role,
        department: newStaffForm.department,
        status: 'Active',
        twoFactorEnabled: newStaffForm.twoFactor,
        lastLogin: 'Never',
        joined: new Date().toISOString().split('T')[0],
        permissions: ['products', 'orders'],
      };

      setStaffList((prev) => [newStaff, ...prev]);
      setAddStaffOpen(false);
      setNewStaffForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Store Manager',
        department: 'Operations',
        twoFactor: true,
      });
      toast('success', 'Invitation Sent', `${newStaff.name} has been added and invited to the team.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create staff member.';
      toast('error', 'Creation Failed', message);
    }
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

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStaffUser) return;

    try {
      await api.put(`/users/${editStaffUser.id}`, {
        name: editStaffUser.name,
        email: editStaffUser.email,
        phone: editStaffUser.phone,
        role: editStaffUser.role,
        status: editStaffUser.status,
        twoFactorEnabled: editStaffUser.twoFactorEnabled,
      });

      setStaffList((prev) =>
        prev.map((s) => (s.id === editStaffUser.id ? editStaffUser : s))
      );
      toast('success', 'User updated', `Updated account for ${editStaffUser.name}.`);
      setEditStaffUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update user.';
      toast('error', 'Update Failed', message);
    }
  };

  const handleDeleteStaff = async () => {
    if (!deleteStaffUser) return;
    try {
      await api.delete(`/users/${deleteStaffUser.id}`);
      setStaffList((prev) => prev.filter((s) => s.id !== deleteStaffUser.id));
      toast('success', 'Staff Member Removed', `${deleteStaffUser.name} was removed from the team.`);
      setDeleteStaffUser(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete user.';
      toast('error', 'Removal Failed', message);
    }
  };

  const handleToggleCustomerBlock = async (customer: Customer) => {
    const newStatus = customer.status === 'Blocked' ? 'Active' : 'Blocked';
    try {
      await api.put(`/users/${customer.id}`, { status: newStatus });
      setCustomerList((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c))
      );
      toast(
        newStatus === 'Blocked' ? 'warning' : 'success',
        newStatus === 'Blocked' ? 'Customer Blocked' : 'Customer Restored',
        `${customer.name} is now ${newStatus.toLowerCase()}.`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update customer status.';
      toast('error', 'Action Failed', message);
    }
  };

  const handleExport = () => {
    toast('info', 'Export generating', 'Exporting user directory as CSV…');
  };

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage administrative staff, permissions matrix, and customer directory."
      >
        <Button variant="secondary" icon={DownloadIcon} onClick={handleExport}>
          Export
        </Button>
        <Button icon={UserPlusIcon} onClick={() => setAddStaffOpen(true)}>
          Invite Staff
        </Button>
      </PageHeader>

      {/* ── Stat KPI Cards ── */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-ink-50">Total Users</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream text-brown">
              <UsersIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{totalUsers}</p>
          <p className="mt-0.5 text-[11.5px] text-ink-50">Staff &amp; Customers combined</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-ink-50">Active Staff</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-tint text-sage">
              <ShieldCheckIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{activeStaffCount}</p>
          <p className="mt-0.5 text-[11.5px] text-sage font-medium">With admin access</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-ink-50">Active Customers</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-tint text-gold">
              <UserCheckIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{activeCustomersCount}</p>
          <p className="mt-0.5 text-[11.5px] text-ink-50">Registered storefront shoppers</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-ink-50">Suspended / Flagged</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger-tint text-danger">
              <ShieldAlertIcon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-semibold text-danger">{suspendedCount}</p>
          <p className="mt-0.5 text-[11.5px] text-ink-50">Blocked from store or dashboard</p>
        </Card>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="mb-5 flex flex-wrap gap-2 border-b border-line pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={classNames(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-ink text-cream shadow-sm'
                  : 'text-ink-70 hover:bg-cream/70 hover:text-ink'
              )}
            >
              <Icon className={classNames('h-4 w-4', isActive ? 'text-gold' : 'text-ink-50')} />
              {t.label}
              {t.id === 'team' && (
                <span className={classNames('ml-1 rounded-full px-1.5 py-0.2 text-[11px]', isActive ? 'bg-cream/20 text-cream' : 'bg-line text-ink-70')}>
                  {staffList.length}
                </span>
              )}
              {t.id === 'customers' && (
                <span className={classNames('ml-1 rounded-full px-1.5 py-0.2 text-[11px]', isActive ? 'bg-cream/20 text-cream' : 'bg-line text-ink-70')}>
                  {customerList.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB 1: TEAM & STAFF
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'team' && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 min-w-[220px]">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-30" />
                <input
                  type="text"
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  placeholder="Search staff by name, email, or phone…"
                  className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-4 text-sm text-ink placeholder:text-ink-30 focus:border-brown-soft focus:bg-surface focus:outline-none"
                />
              </div>
              <Select
                label="Role"
                value={staffRoleFilter}
                onChange={setStaffRoleFilter}
                options={['All roles', 'Super Admin', 'Store Admin', 'Store Manager', 'Support Agent', 'Inventory Lead']}
                className="w-[170px]"
              />
              <Select
                label="Status"
                value={staffStatusFilter}
                onChange={setStaffStatusFilter}
                options={['All statuses', 'Active', 'Inactive', 'Suspended']}
                className="w-[150px]"
              />
            </div>
            <Button size="sm" icon={UserPlusIcon} onClick={() => setAddStaffOpen(true)}>
              Add Member
            </Button>
          </div>

          <TableShell>
            <thead>
              <tr>
                <Th>Staff Member</Th>
                <Th>Role &amp; Department</Th>
                <Th>2FA Security</Th>
                <Th>Status</Th>
                <Th>Last Active</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <Tr key={staff.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="h-10 w-10 rounded-full object-cover border border-line"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-ink flex items-center gap-1.5">
                          {staff.name}
                          {staff.role === 'Super Admin' && (
                            <span className="rounded bg-gold/15 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider text-gold">
                              Owner
                            </span>
                          )}
                        </p>
                        <p className="text-[12px] text-ink-50">{staff.email}</p>
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <div>
                      <p className="font-medium text-ink text-[13px]">{staff.role}</p>
                      <p className="text-[11.5px] text-ink-50">{staff.department}</p>
                    </div>
                  </Td>

                  <Td>
                    {staff.twoFactorEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-sage">
                        <CheckCircle2Icon className="h-3.5 w-3.5" /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[12px] text-ink-30">
                        <XCircleIcon className="h-3.5 w-3.5" /> Disabled
                      </span>
                    )}
                  </Td>

                  <Td>
                    <StatusPill status={staff.status} />
                  </Td>

                  <Td className="whitespace-nowrap text-[12.5px] text-ink-50 font-mono">
                    {staff.lastLogin}
                  </Td>

                  <Td className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <IconButton
                        label="Edit Profile"
                        icon={EditIcon}
                        onClick={() => setEditStaffUser(staff)}
                      />
                      {staff.role !== 'Super Admin' && (
                        <IconButton
                          label="Remove Staff"
                          icon={Trash2Icon}
                          onClick={() => setDeleteStaffUser(staff)}
                          className="text-danger hover:bg-danger-tint"
                        />
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 2: CUSTOMERS DIRECTORY
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'customers' && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 min-w-[220px]">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-30" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customers by name, phone, city, or email…"
                  className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-4 text-sm text-ink placeholder:text-ink-30 focus:border-brown-soft focus:bg-surface focus:outline-none"
                />
              </div>
              <Select
                label="Status"
                value={customerStatusFilter}
                onChange={setCustomerStatusFilter}
                options={['All statuses', 'Active', 'New', 'Blocked']}
                className="w-[160px]"
              />
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[13px] text-ink-50">
                Showing <span className="font-semibold text-ink">{filteredCustomers.length}</span> customers
              </p>
              <Button size="sm" icon={UserPlusIcon} onClick={() => setAddCustomerOpen(true)}>
                Add Customer
              </Button>
            </div>
          </div>

          <TableShell>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Contact</Th>
                <Th>City</Th>
                <Th>Total Orders</Th>
                <Th>Lifetime Spend</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <Tr key={c.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={c.name} className="h-10 w-10 rounded-full object-cover" />
                      <div>
                        <Link
                          to={`/admin/customers/${c.id}`}
                          className="font-medium text-ink hover:text-brown transition-colors"
                        >
                          {c.name}
                        </Link>
                        <p className="text-[11.5px] text-ink-50">Joined {shortDate(c.joined)}</p>
                      </div>
                    </div>
                  </Td>

                  <Td>
                    <p className="text-[13px] text-ink">{c.email}</p>
                    <p className="text-[12px] text-ink-50">{c.phone}</p>
                  </Td>

                  <Td className="text-[13px] text-ink">{c.city}</Td>

                  <Td className="font-medium text-ink text-[13px]">{c.orders} orders</Td>

                  <Td className="font-medium text-ink text-[13px]">{bdt(c.spent)}</Td>

                  <Td>
                    <StatusPill status={c.status} />
                  </Td>

                  <Td>
                    <div className="flex justify-end gap-1.5">
                      <Link
                        to={`/admin/customers/${c.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-70 hover:bg-cream hover:text-ink transition-colors"
                        title="View Customer Profile"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <IconButton
                        label={c.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
                        icon={c.status === 'Blocked' ? UnlockIcon : LockIcon}
                        onClick={() => handleToggleCustomerBlock(c)}
                        className={c.status === 'Blocked' ? 'text-sage hover:bg-sage-tint' : 'text-danger hover:bg-danger-tint'}
                      />
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 3: ROLES & PERMISSIONS MATRIX
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {rolesList.map((role) => (
              <Card key={role.id} className="flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={classNames('rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', role.badgeColor)}>
                      {role.name}
                    </span>
                    <span className="text-[12px] text-ink-50">{role.usersCount} user{role.usersCount > 1 ? 's' : ''}</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-ink-70">{role.description}</p>
                </div>
                <div className="mt-5 border-t border-line pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-30 mb-2">Key Privileges</p>
                  <ul className="space-y-1 text-[12px] text-ink">
                    {role.permissions
                      .flatMap((p) => p.items)
                      .filter((i) => i.granted)
                      .slice(0, 3)
                      .map((item) => (
                        <li key={item.key} className="flex items-center gap-2">
                          <CheckCircle2Icon className="h-3.5 w-3.5 text-sage" />
                          <span>{item.label}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader
              title="Granular Permission Matrix"
              subtitle="Inspect role-level access rights across core storefront subsystems"
            />
            <div className="divide-y divide-line p-5">
              {rolesList[0].permissions.map((cat, catIdx) => (
                <div key={cat.category} className="py-4 first:pt-0 last:pb-0">
                  <h4 className="font-display text-[15px] font-semibold text-ink mb-3">{cat.category}</h4>
                  <div className="space-y-3">
                    {cat.items.map((item) => (
                      <div key={item.key} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-cream/30 p-3.5">
                        <div>
                          <p className="text-[13px] font-medium text-ink">{item.label}</p>
                          <code className="text-[11px] text-ink-50">{item.key}</code>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {rolesList.map((r) => {
                            const hasPermission = r.permissions[catIdx]?.items.find((i) => i.key === item.key)?.granted;
                            return (
                              <span
                                key={r.id}
                                className={classNames(
                                   'rounded-lg px-2.5 py-1 text-[11px] font-medium border',
                                  hasPermission
                                    ? 'bg-sage-tint text-sage border-sage/20'
                                    : 'bg-surface text-ink-30 border-line'
                                )}
                              >
                                {r.name.split(' ')[0]}: {hasPermission ? '✓ Yes' : '✕ No'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB 4: AUDIT & SECURITY LOGS
      ═══════════════════════════════════════════════════════ */}
      {activeTab === 'audit' && (
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
            <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1 min-w-[220px]">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-30" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Filter logs by actor, action, target, or details…"
                  className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-4 text-sm text-ink placeholder:text-ink-30 focus:border-brown-soft focus:bg-surface focus:outline-none"
                />
              </div>
              <Select
                label="Result Status"
                value={auditStatusFilter}
                onChange={setAuditStatusFilter}
                options={['All', 'Success', 'Warning', 'Failed']}
                className="w-[150px]"
              />
            </div>
            <Button
              size="sm"
              variant="secondary"
              icon={RefreshCwIcon}
              onClick={() => {
                fetchUsersAndLogs();
                toast('info', 'Logs Refreshed', 'Audit log is up to date.');
              }}
            >
              Refresh
            </Button>
          </div>

          <TableShell>
            <thead>
              <tr>
                <Th>Timestamp</Th>
                <Th>Actor</Th>
                <Th>Action &amp; Target</Th>
                <Th>Details</Th>
                <Th>IP &amp; Device</Th>
                <Th className="text-right">Outcome</Th>
              </tr>
            </thead>
            <tbody>
              {filteredAudit.map((log) => (
                <Tr key={log.id}>
                  <Td className="whitespace-nowrap text-[12px] text-ink-50 font-mono">
                    {log.timestamp}
                  </Td>

                  <Td>
                    <div>
                      <p className="font-medium text-ink text-[13px]">{log.actorName}</p>
                      <p className="text-[11.5px] text-ink-50">{log.actorEmail}</p>
                    </div>
                  </Td>

                  <Td>
                    <div>
                      <p className="font-medium text-ink text-[13px]">{log.action}</p>
                      <p className="text-[11.5px] text-brown">{log.targetUser}</p>
                    </div>
                  </Td>

                  <Td className="text-[12.5px] text-ink-70 max-w-xs truncate">
                    {log.details}
                  </Td>

                  <Td className="text-[12px] text-ink-50 font-mono">
                    {log.ipAddress}
                  </Td>

                  <Td className="text-right">
                    <span
                      className={classNames(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border',
                        log.status === 'Success'
                          ? 'bg-sage-tint text-sage border-sage/30'
                          : log.status === 'Warning'
                          ? 'bg-gold-tint text-gold border-gold/30'
                          : 'bg-danger-tint text-danger border-danger/30'
                      )}
                    >
                      {log.status}
                    </span>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODALS & DIALOGS
      ═══════════════════════════════════════════════════════ */}

      {/* ── Invite / Add Staff Modal ── */}
      <Modal
        open={addStaffOpen}
        onClose={() => setAddStaffOpen(false)}
        title="Invite New Staff Member"
      >
        <form onSubmit={handleCreateStaff} className="space-y-4">
          <p className="text-[13px] text-ink-50">
            Create an administrator, manager, or support agent account with access credentials.
          </p>

          <Field label="Full Name" required>
            <TextInput
              required
              placeholder="e.g. Mahfuzur Rahman"
              value={newStaffForm.name}
              onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email Address" required>
              <TextInput
                type="email"
                required
                placeholder="staff@tagdiah.com"
                value={newStaffForm.email}
                onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
              />
            </Field>

            <Field label="Phone Number">
              <TextInput
                type="tel"
                placeholder="+880 1700 000 000"
                value={newStaffForm.phone}
                onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Initial Password (Optional)">
              <div className="flex gap-2">
                <TextInput
                  type="text"
                  placeholder="Auto-generated if empty"
                  value={newStaffForm.password}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setNewStaffForm({ ...newStaffForm, password: generatePassword() })}
                  title="Generate Password"
                >
                  <SparklesIcon className="h-4 w-4 text-gold" />
                </Button>
              </div>
            </Field>

            <Field label="Assigned Role" required>
              <Select
                label="Role"
                value={newStaffForm.role}
                onChange={(v) => setNewStaffForm({ ...newStaffForm, role: v as StaffRole })}
                options={['Store Admin', 'Store Manager', 'Support Agent', 'Inventory Lead']}
              />
            </Field>
          </div>

          <Field label="Department">
            <Select
              label="Department"
              value={newStaffForm.department}
              onChange={(v) => setNewStaffForm({ ...newStaffForm, department: v })}
              options={['Operations', 'Sales & Marketing', 'Customer Service', 'Warehouse & Logistics']}
            />
          </Field>

          <div className="rounded-xl border border-line bg-cream/40 p-4">
            <Toggle
              checked={newStaffForm.twoFactor}
              onChange={(v) => setNewStaffForm({ ...newStaffForm, twoFactor: v })}
              label="Enforce Two-Factor Authentication (2FA)"
              description="Requires an SMS verification code on login for security."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setAddStaffOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Staff Account</Button>
          </div>
        </form>
      </Modal>

      {/* ── Add Customer Modal (Sends Email with Credentials) ── */}
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

      {/* ── Edit Staff User Modal ── */}
      {editStaffUser && (
        <Modal
          open={!!editStaffUser}
          onClose={() => setEditStaffUser(null)}
          title={`Edit Account: ${editStaffUser.name}`}
        >
          <form onSubmit={handleUpdateStaff} className="space-y-4">
            <Field label="Full Name">
              <TextInput
                value={editStaffUser.name}
                onChange={(e) => setEditStaffUser({ ...editStaffUser, name: e.target.value })}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Email Address">
                <TextInput
                  type="email"
                  value={editStaffUser.email}
                  onChange={(e) => setEditStaffUser({ ...editStaffUser, email: e.target.value })}
                />
              </Field>
              <Field label="Phone">
                <TextInput
                  value={editStaffUser.phone}
                  onChange={(e) => setEditStaffUser({ ...editStaffUser, phone: e.target.value })}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Role">
                <Select
                  label="Role"
                  value={editStaffUser.role}
                  onChange={(v) => setEditStaffUser({ ...editStaffUser, role: v as StaffRole })}
                  options={['Super Admin', 'Store Admin', 'Store Manager', 'Support Agent', 'Inventory Lead']}
                />
              </Field>

              <Field label="Status">
                <Select
                  label="Status"
                  value={editStaffUser.status}
                  onChange={(v) => setEditStaffUser({ ...editStaffUser, status: v as StaffUser['status'] })}
                  options={['Active', 'Inactive', 'Suspended']}
                />
              </Field>
            </div>

            <div className="rounded-xl border border-line bg-cream/40 p-4">
              <Toggle
                checked={editStaffUser.twoFactorEnabled}
                onChange={(v) => setEditStaffUser({ ...editStaffUser, twoFactorEnabled: v })}
                label="Two-Factor Authentication"
                description="Status of device verification requirement."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" type="button" onClick={() => setEditStaffUser(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Confirm Delete Staff ── */}
      <ConfirmDialog
        open={!!deleteStaffUser}
        onClose={() => setDeleteStaffUser(null)}
        onConfirm={handleDeleteStaff}
        title={`Remove ${deleteStaffUser?.name}?`}
        message="This user will immediately lose access to the Tagdiah admin dashboard and order operations."
        confirmLabel="Remove User"
      />
    </>
  );
}
