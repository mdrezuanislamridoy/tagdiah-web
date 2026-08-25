import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken, clearToken, getToken } from '../utils/api';

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
  avatar?: string;
  department?: string;
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

/* ── API response types ── */
interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    avatar?: string;
    department?: string;
    since?: string;
  };
}

interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  avatar?: string;
  department?: string;
  since?: string;
}

/** Normalize a role string from the backend to our frontend UserRole type */
function normalizeRole(role: string): UserRole {
  const adminRoles = ['Super Admin', 'Store Admin', 'Store Manager', 'Support Agent'];
  return adminRoles.includes(role) ? 'admin' : 'customer';
}

function toAuthUser(data: AuthResponse['user'] | ProfileResponse): AuthUser {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: normalizeRole(data.role),
    since: data.since || '',
    phone: data.phone,
    address: data.address,
    avatar: data.avatar,
    department: data.department,
  };
}

/* ── Provider ── */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* restore session on mount — validate JWT with /auth/me */
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.get<ProfileResponse>('/auth/me')
      .then((profile) => {
        setUser(toAuthUser(profile));
      })
      .catch(() => {
        // Token invalid or expired
        clearToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /* ── Login (customers) ── */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post<AuthResponse>('/auth/login', { email, password });
      setToken(data.accessToken);
      setUser(toAuthUser(data.user));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Admin Login ── */
  const adminLogin = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post<AuthResponse>('/auth/admin/login', { email, password });
      setToken(data.accessToken);
      setUser(toAuthUser(data.user));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Signup ── */
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const data = await api.post<AuthResponse>('/auth/register', { name, email, password });
      setToken(data.accessToken);
      setUser(toAuthUser(data.user));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  /* ── Update profile (optimistic local + persist to backend) ── */
  const updateProfile = useCallback((data: Partial<Pick<AuthUser, 'name' | 'phone' | 'address'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
    // Note: profile update API endpoint can be added later
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
