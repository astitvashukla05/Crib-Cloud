'use client';

import React, { useEffect, useState } from 'react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import Navbar from '@/components/Navbar';
import { useGetAuthUserQuery } from '@/state/api';
import { useRouter, usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isRouting, setIsRouting] = useState(true);

  useEffect(() => {
    if (!authUser) return;

    const role = authUser.userRole?.toLowerCase();

    // Manager should NOT access tenant or public routes
    if (role === 'manager') {
      if (pathname.startsWith('/search') || pathname.startsWith('/landing')) {
        router.push('/managers/properties');
        return;
      }
    }

    // Tenant should NOT access manager routes
    if (role === 'tenant') {
      if (pathname.startsWith('/managers')) {
        router.push('/tenants/favourites');
        return;
      }
    }

    setIsRouting(false);
  }, [authUser, pathname, router]);

  if (authLoading || isRouting) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className="h-full flex w-full flex-col"
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
