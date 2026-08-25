import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ConfirmDialog } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../../contexts/AuthContext';

export function AdminLayout() {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toast = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <Sidebar
        onLogout={() => setConfirmLogout(true)}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          onLogout={() => setConfirmLogout(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="scroll-thin flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
          toast('info', 'Signed out', 'You have been logged out of the Tagdiah admin.');
          navigate('/admin/login');
        }}
        title="Log out of Tagdiah Admin?"
        message="Any unsaved changes on this screen will be lost. You'll need to sign in again to manage the store."
        confirmLabel="Log out"
        destructive={false}
      />
    </div>
  );
}