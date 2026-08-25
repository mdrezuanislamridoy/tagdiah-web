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
  city?: string;
  avatar?: string;
  department?: string;
}

interface AuthValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; userId?: string; userEmail?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; userId?: string; userEmail?: string }>;
  verifyEmail: (userId: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendCode: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'phone' | 'address' | 'city'>>) => Promise<{ success: boolean; error?: string }>;
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
    city?: string;
    avatar?: string;
    department?: string;
    since?: string;
  };
}

interface RegisterResponse {
  message: string;
  userId: string;
  email: string;
}

interface LoginResponse extends Partial<AuthResponse> {
  needsVerification?: boolean;
  userId?: string;
  email?: string;
  message?: string;
}

interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
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
    city: data.city,
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
        clearToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  /* ── Signup (returns userId for verification) ── */
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const data = await api.post<RegisterResponse>('/auth/register', { name, email, password });
      return { success: true, userId: data.userId, userEmail: data.email };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Verify Email (completes registration, logs in) ── */
  const verifyEmail = useCallback(async (userId: string, code: string) => {
    try {
      const data = await api.post<AuthResponse>('/auth/verify-email', { userId, code });
      setToken(data.accessToken);
      setUser(toAuthUser(data.user));
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Resend Verification Code ── */
  const resendCode = useCallback(async (email: string) => {
    try {
      await api.post('/auth/resend-code', { email });
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend code.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Login (customers) ── */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.post<LoginResponse>('/auth/login', { email, password });

      // Handle unverified email — backend returns needsVerification
      if (data.needsVerification) {
        return {
          success: false,
          needsVerification: true,
          userId: data.userId,
          userEmail: data.email,
          error: data.message || 'Please verify your email first.',
        };
      }

      if (data.accessToken && data.user) {
        setToken(data.accessToken);
        setUser(toAuthUser(data.user));
      }
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

  /* ── Forgot Password ── */
  const forgotPassword = useCallback(async (email: string) => {
    try {
      const data = await api.post<{ message: string }>('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset code.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Reset Password ── */
  const resetPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    try {
      const data = await api.post<{ message: string }>('/auth/reset-password', { email, code, newPassword });
      return { success: true, message: data.message };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Password reset failed.';
      return { success: false, error: message };
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  /* ── Update profile ── */
  const updateProfile = useCallback(async (data: Partial<Pick<AuthUser, 'name' | 'phone' | 'address' | 'city'>>) => {
    setUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });

    if (user?.id) {
      try {
        await api.put(`/users/${user.id}`, data);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to update profile.';
        return { success: false, error: message };
      }
    }
    return { success: true };
  }, [user?.id]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isLoading,
      login,
      adminLogin,
      signup,
      verifyEmail,
      resendCode,
      forgotPassword,
      resetPassword,
      logout,
      updateProfile,
    }),
    [user, isLoading, login, adminLogin, signup, verifyEmail, resendCode, forgotPassword, resetPassword, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
