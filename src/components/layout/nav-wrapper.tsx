'use client';

import { usePathname } from 'next/navigation';

import { BottomNav } from './bottom-nav';
import { TopNav } from './top-nav';

const HIDE_NAV_ROUTES = ['/login'];

export function NavWrapper() {
  const pathname = usePathname();

  // Hide navigation on certain routes (e.g., login page)
  if (HIDE_NAV_ROUTES.includes(pathname)) {
    return null;
  }

  return (
    <>
      {/* Desktop: Top Nav */}
      <div className="hidden md:block">
        <TopNav />
      </div>

      {/* Mobile: Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </>
  );
}
