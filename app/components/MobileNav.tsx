'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { getRoleLabel } from '@/lib/translations';
import clsx from 'clsx';
import {
  Home,
  ShoppingCart,
  Package,
  Truck,
  Wrench,
  MoreVertical,
} from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user || pathname === '/auth') return null;

  const getNavItems = () => {
    if (user.role === 'delivery') {
      return [
        { href: '/deliveries', label: 'Entregas', icon: Truck },
        { href: '/dashboard', label: 'Inicio', icon: Home },
      ];
    }

    if (user.role === 'vendor') {
      return [
        { href: '/pos', label: 'Venta', icon: ShoppingCart },
        { href: '/diagnosis', label: 'Diagnóstico', icon: Wrench },
        { href: '/inventory', label: 'Stock', icon: Package },
        { href: '/dashboard', label: 'Inicio', icon: Home },
      ];
    }

    return [
      { href: '/dashboard', label: 'Inicio', icon: Home },
      { href: '/pos', label: 'Venta', icon: ShoppingCart },
      { href: '/inventory', label: 'Inventario', icon: Package },
      { href: '/delivery', label: 'Delivery', icon: Truck },
      { href: '#', label: 'Más', icon: MoreVertical },
    ];
  };

  const navItems = getNavItems();
  const isActive = (href: string) => pathname === href;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-2 py-2">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className="flex-1">
          <div
            className={clsx(
              'flex flex-col items-center gap-1 py-2 px-2 rounded transition-colors text-xs',
              isActive(href)
                ? 'text-violet-500'
                : 'text-gray-400'
            )}
          >
            <Icon size={24} />
            <span className="text-xs">{label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
