'use client';

import Navbar from '@/components/Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { useGetAuthUserQuery } from '@/state/api';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    const role = authUser.userRole?.toLowerCase();

    if (role === 'manager') {
      if (pathname.startsWith('/tenants')) {
        router.replace('/managers/properties');
        return;
      }
    }

    if (role === 'tenant') {
      if (pathname.startsWith('/managers')) {
        router.replace('/tenants/favourites');
        return;
      }
    }

    setLoading(false);
  }, [authUser, pathname, router]);

  if (authLoading || loading) return <>Loading…</>;
  if (!authUser?.userRole) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-primary-100">
        <Navbar />

        <div style={{ paddingTop: NAVBAR_HEIGHT }}>
          <main className="flex">
            <AppSidebar userType={authUser.userRole.toLowerCase()} />

            <div className="flex-grow transition-all duration-300 p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
