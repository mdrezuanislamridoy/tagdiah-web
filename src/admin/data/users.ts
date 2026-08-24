import type { StaffUser, RoleDefinition, UserAuditLog } from '../types';

const av = (seed: string) => `https://i.pravatar.cc/120?u=tagdiah-staff-${seed}`;

export const initialStaffUsers: StaffUser[] = [
  {
    id: 'st-01',
    name: 'Shabnam Akter',
    email: 'shabnam@tagdiah.com',
    phone: '+880 1700 000 101',
    avatar: av('shabnam'),
    role: 'Super Admin',
    department: 'Executive',
    status: 'Active',
    twoFactorEnabled: true,
    lastLogin: '2026-08-24 21:40',
    joined: '2023-01-10',
    permissions: ['all'],
  },
  {
    id: 'st-02',
    name: 'Rezuan Islam Ridoy',
    email: 'ridoy@tagdiah.com',
    phone: '+880 1712 004 118',
    avatar: av('ridoy'),
    role: 'Store Admin',
    department: 'Operations',
    status: 'Active',
    twoFactorEnabled: true,
    lastLogin: '2026-08-24 22:15',
    joined: '2023-04-15',
    permissions: ['products', 'orders', 'inventory', 'analytics', 'customers', 'settings'],
  },
  {
    id: 'st-03',
    name: 'Tariqul Alam',
    email: 'tariqul@tagdiah.com',
    phone: '+880 1819 443 209',
    avatar: av('tariqul'),
    role: 'Store Manager',
    department: 'Sales & Marketing',
    status: 'Active',
    twoFactorEnabled: false,
    lastLogin: '2026-08-24 18:22',
    joined: '2024-02-01',
    permissions: ['products', 'orders', 'customers', 'coupons', 'banners'],
  },
  {
    id: 'st-04',
    name: 'Tasnim Zarin',
    email: 'tasnim@tagdiah.com',
    phone: '+880 1922 887 612',
    avatar: av('tasnim'),
    role: 'Support Agent',
    department: 'Customer Service',
    status: 'Active',
    twoFactorEnabled: false,
    lastLogin: '2026-08-24 19:45',
    joined: '2024-08-12',
    permissions: ['orders.view', 'orders.update', 'reviews', 'customers.view'],
  },
  {
    id: 'st-05',
    name: 'Mahmudur Rahman',
    email: 'mahmud@tagdiah.com',
    phone: '+880 1688 123 904',
    avatar: av('mahmud'),
    role: 'Inventory Lead',
    department: 'Warehouse & Logistics',
    status: 'Active',
    twoFactorEnabled: true,
    lastLogin: '2026-08-23 15:30',
    joined: '2024-11-20',
    permissions: ['inventory', 'products.view', 'products.edit_stock'],
  },
  {
    id: 'st-06',
    name: 'Nabila Hasan',
    email: 'nabila@tagdiah.com',
    phone: '+880 1755 990 311',
    avatar: av('nabila'),
    role: 'Support Agent',
    department: 'Customer Service',
    status: 'Inactive',
    twoFactorEnabled: false,
    lastLogin: '2026-07-19 11:05',
    joined: '2025-03-05',
    permissions: ['orders.view', 'reviews'],
  },
];

export const initialRoles: RoleDefinition[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin',
    description: 'Full unrestricted access to all dashboard operations, financial settings, and user management.',
    usersCount: 1,
    badgeColor: 'bg-terracotta-tint text-terracotta border-terracotta/30',
    permissions: [
      {
        category: 'Store & Products',
        items: [
          { key: 'products.create', label: 'Create & Publish Products', granted: true },
          { key: 'products.edit', label: 'Edit Product Details & Pricing', granted: true },
          { key: 'products.delete', label: 'Delete Products', granted: true },
          { key: 'categories.manage', label: 'Manage Categories & Subcategories', granted: true },
        ],
      },
      {
        category: 'Orders & Fulfillment',
        items: [
          { key: 'orders.view', label: 'View All Orders & Details', granted: true },
          { key: 'orders.status', label: 'Update Order Status & Dispatch', granted: true },
          { key: 'orders.cancel_refund', label: 'Cancel Orders & Issue Refunds', granted: true },
        ],
      },
      {
        category: 'Customers & Support',
        items: [
          { key: 'customers.manage', label: 'View & Manage Customer Profiles', granted: true },
          { key: 'customers.block', label: 'Block / Unblock Accounts', granted: true },
          { key: 'reviews.moderate', label: 'Moderate & Approve Reviews', granted: true },
        ],
      },
      {
        category: 'Administration & System',
        items: [
          { key: 'users.manage', label: 'Manage Staff Users & Roles', granted: true },
          { key: 'settings.edit', label: 'Edit Store Settings & VAT', granted: true },
          { key: 'analytics.view', label: 'View Revenue & Financial Reports', granted: true },
        ],
      },
    ],
  },
  {
    id: 'role-store-admin',
    name: 'Store Admin',
    description: 'Manage catalogue, fulfill orders, handle promotions and view daily operational metrics.',
    usersCount: 1,
    badgeColor: 'bg-brown-tint text-brown border-brown/30',
    permissions: [
      {
        category: 'Store & Products',
        items: [
          { key: 'products.create', label: 'Create & Publish Products', granted: true },
          { key: 'products.edit', label: 'Edit Product Details & Pricing', granted: true },
          { key: 'products.delete', label: 'Delete Products', granted: true },
          { key: 'categories.manage', label: 'Manage Categories & Subcategories', granted: true },
        ],
      },
      {
        category: 'Orders & Fulfillment',
        items: [
          { key: 'orders.view', label: 'View All Orders & Details', granted: true },
          { key: 'orders.status', label: 'Update Order Status & Dispatch', granted: true },
          { key: 'orders.cancel_refund', label: 'Cancel Orders & Issue Refunds', granted: true },
        ],
      },
      {
        category: 'Customers & Support',
        items: [
          { key: 'customers.manage', label: 'View & Manage Customer Profiles', granted: true },
          { key: 'customers.block', label: 'Block / Unblock Accounts', granted: true },
          { key: 'reviews.moderate', label: 'Moderate & Approve Reviews', granted: true },
        ],
      },
      {
        category: 'Administration & System',
        items: [
          { key: 'users.manage', label: 'Manage Staff Users & Roles', granted: false },
          { key: 'settings.edit', label: 'Edit Store Settings & VAT', granted: false },
          { key: 'analytics.view', label: 'View Revenue & Financial Reports', granted: true },
        ],
      },
    ],
  },
  {
    id: 'role-store-manager',
    name: 'Store Manager',
    description: 'Catalogue maintenance, promotions management, and order review capability.',
    usersCount: 1,
    badgeColor: 'bg-gold-tint text-gold border-gold/30',
    permissions: [
      {
        category: 'Store & Products',
        items: [
          { key: 'products.create', label: 'Create & Publish Products', granted: true },
          { key: 'products.edit', label: 'Edit Product Details & Pricing', granted: true },
          { key: 'products.delete', label: 'Delete Products', granted: false },
          { key: 'categories.manage', label: 'Manage Categories & Subcategories', granted: true },
        ],
      },
      {
        category: 'Orders & Fulfillment',
        items: [
          { key: 'orders.view', label: 'View All Orders & Details', granted: true },
          { key: 'orders.status', label: 'Update Order Status & Dispatch', granted: true },
          { key: 'orders.cancel_refund', label: 'Cancel Orders & Issue Refunds', granted: false },
        ],
      },
      {
        category: 'Customers & Support',
        items: [
          { key: 'customers.manage', label: 'View & Manage Customer Profiles', granted: true },
          { key: 'customers.block', label: 'Block / Unblock Accounts', granted: false },
          { key: 'reviews.moderate', label: 'Moderate & Approve Reviews', granted: true },
        ],
      },
      {
        category: 'Administration & System',
        items: [
          { key: 'users.manage', label: 'Manage Staff Users & Roles', granted: false },
          { key: 'settings.edit', label: 'Edit Store Settings & VAT', granted: false },
          { key: 'analytics.view', label: 'View Revenue & Financial Reports', granted: false },
        ],
      },
    ],
  },
  {
    id: 'role-support-agent',
    name: 'Support Agent',
    description: 'Assigned to customer queries, order lookup, and customer review moderation.',
    usersCount: 2,
    badgeColor: 'bg-sage-tint text-sage border-sage/30',
    permissions: [
      {
        category: 'Store & Products',
        items: [
          { key: 'products.create', label: 'Create & Publish Products', granted: false },
          { key: 'products.edit', label: 'Edit Product Details & Pricing', granted: false },
          { key: 'products.delete', label: 'Delete Products', granted: false },
          { key: 'categories.manage', label: 'Manage Categories & Subcategories', granted: false },
        ],
      },
      {
        category: 'Orders & Fulfillment',
        items: [
          { key: 'orders.view', label: 'View All Orders & Details', granted: true },
          { key: 'orders.status', label: 'Update Order Status & Dispatch', granted: true },
          { key: 'orders.cancel_refund', label: 'Cancel Orders & Issue Refunds', granted: false },
        ],
      },
      {
        category: 'Customers & Support',
        items: [
          { key: 'customers.manage', label: 'View & Manage Customer Profiles', granted: true },
          { key: 'customers.block', label: 'Block / Unblock Accounts', granted: false },
          { key: 'reviews.moderate', label: 'Moderate & Approve Reviews', granted: true },
        ],
      },
      {
        category: 'Administration & System',
        items: [
          { key: 'users.manage', label: 'Manage Staff Users & Roles', granted: false },
          { key: 'settings.edit', label: 'Edit Store Settings & VAT', granted: false },
          { key: 'analytics.view', label: 'View Revenue & Financial Reports', granted: false },
        ],
      },
    ],
  },
  {
    id: 'role-inventory-lead',
    name: 'Inventory Lead',
    description: 'Specialized in warehouse count reconciliation, reorder threshold alerts and batch stock edits.',
    usersCount: 1,
    badgeColor: 'bg-cream text-ink-70 border-line',
    permissions: [
      {
        category: 'Store & Products',
        items: [
          { key: 'products.create', label: 'Create & Publish Products', granted: false },
          { key: 'products.edit', label: 'Edit Product Details & Pricing', granted: false },
          { key: 'products.delete', label: 'Delete Products', granted: false },
          { key: 'categories.manage', label: 'Manage Categories & Subcategories', granted: false },
        ],
      },
      {
        category: 'Orders & Fulfillment',
        items: [
          { key: 'orders.view', label: 'View All Orders & Details', granted: true },
          { key: 'orders.status', label: 'Update Order Status & Dispatch', granted: false },
          { key: 'orders.cancel_refund', label: 'Cancel Orders & Issue Refunds', granted: false },
        ],
      },
      {
        category: 'Customers & Support',
        items: [
          { key: 'customers.manage', label: 'View & Manage Customer Profiles', granted: false },
          { key: 'customers.block', label: 'Block / Unblock Accounts', granted: false },
          { key: 'reviews.moderate', label: 'Moderate & Approve Reviews', granted: false },
        ],
      },
      {
        category: 'Administration & System',
        items: [
          { key: 'users.manage', label: 'Manage Staff Users & Roles', granted: false },
          { key: 'settings.edit', label: 'Edit Store Settings & VAT', granted: false },
          { key: 'analytics.view', label: 'View Revenue & Financial Reports', granted: false },
        ],
      },
    ],
  },
];

export const initialAuditLogs: UserAuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-08-24 22:15:30',
    actorName: 'Rezuan Islam Ridoy',
    actorEmail: 'ridoy@tagdiah.com',
    action: 'Admin Login',
    targetUser: 'Self',
    details: 'Signed into Admin Portal via Session Auth',
    ipAddress: '103.145.72.18 (Dhaka, BD)',
    status: 'Success',
  },
  {
    id: 'log-02',
    timestamp: '2026-08-24 21:40:12',
    actorName: 'Shabnam Akter',
    actorEmail: 'shabnam@tagdiah.com',
    action: 'Permission Modified',
    targetUser: 'Tariqul Alam (Store Manager)',
    details: 'Enabled banner management permission',
    ipAddress: '118.179.201.44 (Dhaka, BD)',
    status: 'Success',
  },
  {
    id: 'log-03',
    timestamp: '2026-08-24 19:48:55',
    actorName: 'Tasnim Zarin',
    actorEmail: 'tasnim@tagdiah.com',
    action: 'Review Moderated',
    targetUser: 'Customer: Sadia Karim',
    details: 'Approved 5-star review for Naqsh Porda',
    ipAddress: '103.205.180.12 (Sylhet, BD)',
    status: 'Success',
  },
  {
    id: 'log-04',
    timestamp: '2026-08-24 16:10:02',
    actorName: 'Shabnam Akter',
    actorEmail: 'shabnam@tagdiah.com',
    action: 'Customer Account Blocked',
    targetUser: 'Rakib Chowdhury (cu-06)',
    details: 'Flagged for multiple fraudulent COD cancellations',
    ipAddress: '118.179.201.44 (Dhaka, BD)',
    status: 'Warning',
  },
  {
    id: 'log-05',
    timestamp: '2026-08-23 15:35:40',
    actorName: 'Mahmudur Rahman',
    actorEmail: 'mahmud@tagdiah.com',
    action: 'Stock Adjustment',
    targetUser: 'SKU: TGD-PD-0003',
    details: 'Reconciled stock count (+15 units)',
    ipAddress: '103.145.72.18 (Dhaka, BD)',
    status: 'Success',
  },
  {
    id: 'log-06',
    timestamp: '2026-08-23 10:12:18',
    actorName: 'System Security',
    actorEmail: 'security@tagdiah.com',
    action: 'Failed Login Attempt',
    targetUser: 'admin@tagdiah.com',
    details: '3 consecutive invalid password attempts',
    ipAddress: '185.220.101.5 (Unknown)',
    status: 'Failed',
  },
];
