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
    <aside className="hidden md:fixed md:left-0 md:top-0 md:flex md:w-64 md:flex-col md:h-screen md:border-r" style={{
      background: 'linear-gradient(180deg, #1a1f3a 0%, #0f172a 100%)',
      borderColor: 'var(--border-light)',
      color: 'var(--text-primary)'
    }}>
      <div className="flex items-center justify-center h-16 border-b px-4" style={{ borderColor: 'var(--border)' }}>
        <h1 className="text-lg font-bold tracking-tight" style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          PoS Retail
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium',
                isActive(href)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-200'
              )}
              style={isActive(href) ? {
                background: `linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)`,
                borderLeft: '3px solid var(--primary)',
                paddingLeft: '12px'
              } : {
                borderLeft: '3px solid transparent'
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="border-t p-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 px-2">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2"
            style={{ borderColor: 'var(--primary)' }}
          />
          <div className="text-sm flex-1">
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getRoleLabel(user.role)}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80"
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ff6b6b',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>
    </aside>
  );
}
