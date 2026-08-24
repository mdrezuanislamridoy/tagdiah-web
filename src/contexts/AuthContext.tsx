import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/* ── Types ── */
export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  since: string;          // e.g. "August 2026"
  phone?: string;
  address?: string;
}

interface AuthValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'phone' | 'address'>>) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

/* ── Simulated users DB (replace with API calls) ── */
const USERS_KEY = 'tagdiah_users';
const SESSION_KEY = 'tagdiah_session';

interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  since: string;
  phone?: string;
  address?: string;
}

/* seed the default admin & demo customer */
function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }

  const seed: StoredUser[] = [
    {
      id: 'admin-001',
      name: 'Tagdiah Admin',
      email: 'admin@tagdiah.com',
      password: 'admin123',
      role: 'admin',
      since: 'January 2024',
    },
    {
      id: 'u-001',
      name: 'Nusrat Jahan',
      email: 'nusrat@example.com',
      password: 'customer123',
      role: 'customer',
      since: 'March 2024',
      phone: '+880 1712 004 118',
      address: 'Flat 4B, House 27, Road 11, Dhanmondi, Dhaka 1209',
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  return seed;
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toAuthUser(u: StoredUser): AuthUser {
  return { id: u.id, name: u.name, email: u.email, role: u.role, since: u.since, phone: u.phone, address: u.address };
}

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

/* ── Provider ── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* restore session on mount */
  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const parsed: AuthUser = JSON.parse(session);
        setUser(parsed);
      }
    } catch { /* ignore */ }
    setIsLoading(false);
  }, []);

  /* persist session changes */
  const persistUser = useCallback((u: AuthUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  /* simulate async delay */
  const delay = () => new Promise<void>((r) => setTimeout(r, 800));

  /* ── Login (customers) ── */
  const login = useCallback(async (email: string, password: string) => {
    await delay();
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === 'customer'
    );
    if (!found) return { success: false, error: 'Invalid email or password.' };
    persistUser(toAuthUser(found));
    return { success: true };
  }, [persistUser]);

  /* ── Admin Login ── */
  const adminLogin = useCallback(async (email: string, password: string) => {
    await delay();
    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === 'admin'
    );
    if (!found) return { success: false, error: 'Invalid admin credentials.' };
    persistUser(toAuthUser(found));
    return { success: true };
  }, [persistUser]);

  /* ── Signup ── */
  const signup = useCallback(async (name: string, email: string, password: string) => {
    await delay();
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const now = new Date();
    const newUser: StoredUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      password,
      role: 'customer',
      since: `${monthNames[now.getMonth()]} ${now.getFullYear()}`,
    };
    users.push(newUser);
    saveStoredUsers(users);
    persistUser(toAuthUser(newUser));
    return { success: true };
  }, [persistUser]);

  /* ── Logout ── */
  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  /* ── Update profile ── */
  const updateProfile = useCallback((data: Partial<Pick<AuthUser, 'name' | 'phone' | 'address'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      /* also update stored users */
      const users = getStoredUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx > -1) {
        users[idx] = { ...users[idx], ...data };
        saveStoredUsers(users);
      }
      return updated;
    });
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      login,
      adminLogin,
      signup,
      logout,
      updateProfile,
    }),
    [user, isLoading, login, adminLogin, signup, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
