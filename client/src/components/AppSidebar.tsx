// src/components/AppSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from './ui/sidebar';
import {
  Building,
  FileText,
  Heart,
  Home,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AppSidebarProps {
  userType: 'manager' | 'tenant';
}

function AppSidebar({ userType }: AppSidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const navLinks =
    userType === 'manager'
      ? [
          { icon: Building, label: 'Properties', href: '/managers/properties' },
          {
            icon: FileText,
            label: 'Applications',
            href: '/managers/applications',
          },
          { icon: Settings, label: 'Settings', href: '/managers/settings' },
        ]
      : [
          { icon: Heart, label: 'Favorites', href: '/tenants/favorites' },
          {
            icon: FileText,
            label: 'Applications',
            href: '/tenants/applications',
          },
          { icon: Home, label: 'Residences', href: '/tenants/residences' },
          { icon: Settings, label: 'Settings', href: '/tenants/settings' },
        ];

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                'flex min-h-[56px] w-full items-center pt-3 mb-3',
                open ? 'justify-between px-6' : 'justify-center'
              )}
            >
              {open ? (
                <>
                  <h1 className="text-xl font-bold text-gray-800">
                    {userType === 'manager' ? 'Manager View' : 'Renter View'}
                  </h1>
                  <button
                    className="hover:bg-gray-100 p-2 rounded-md"
                    onClick={toggleSidebar}
                    aria-label="Close sidebar"
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              ) : (
                <button
                  className="hover:bg-gray-100 p-2 rounded-md"
                  onClick={toggleSidebar}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              )}
            </div>
          </SidebarMenuItem>

          {navLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100',
                  pathname === link.href ? 'bg-gray-100 font-semibold' : ''
                )}
              >
                <link.icon className="h-5 w-5" />
                {open && <span>{link.label}</span>}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}

export default AppSidebar;
