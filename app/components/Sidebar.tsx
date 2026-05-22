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
  TrendingUp,
  Truck,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Wrench,
  ArrowRightLeft,
  Zap,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const baseMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
  ];

  const roleMenuItems = {
    admin: [
      { href: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
      { href: '/inventory', label: 'Inventario', icon: Package },
      { href: '/transfers', label: 'Transferencias', icon: ArrowRightLeft },
      { href: '/delivery', label: 'Delivery', icon: Truck },
      { href: '/cash', label: 'Caja', icon: DollarSign },
      { href: '/invoicing', label: 'Facturas', icon: FileText },
      { href: '/erp', label: 'ERP/SAP', icon: Zap },
      { href: '/admin', label: 'Administración', icon: Settings },
      { href: '/reports', label: 'Reportes', icon: TrendingUp },
    ],
    store_manager: [
      { href: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
      { href: '/inventory', label: 'Inventario', icon: Package },
      { href: '/transfers', label: 'Transferencias', icon: ArrowRightLeft },
      { href: '/delivery', label: 'Delivery', icon: Truck },
      { href: '/cash', label: 'Caja', icon: DollarSign },
      { href: '/reports', label: 'Reportes', icon: TrendingUp },
    ],
    vendor: [
      { href: '/pos', label: 'Punto de Venta', icon: ShoppingCart },
      { href: '/diagnosis', label: 'Diagnóstico', icon: Wrench },
      { href: '/inventory', label: 'Consultar Stock', icon: Package },
    ],
    delivery: [
      { href: '/deliveries', label: 'Mis Entregas', icon: Truck },
    ],
  };

  const menuItems = [
    ...baseMenuItems,
    ...(roleMenuItems[user.role] || []),
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="hidden md:fixed md:left-0 md:top-0 md:flex md:w-64 md:flex-col md:bg-gray-900 md:text-white md:h-screen md:border-r md:border-gray-800">
      <div className="flex items-center justify-center h-16 border-b border-gray-800 px-4">
        <h1 className="text-xl font-bold">PoS Retail</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                isActive(href)
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              )}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div className="text-sm">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-400">{getRoleLabel(user.role)}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>
    </aside>
  );
}
