import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/context/AuthContext';
import Sidebar from '@/app/components/Sidebar';
import MobileNav from '@/app/components/MobileNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'PoS Retail - Sistema de Punto de Venta Automotriz',
  description: 'Plataforma integral de gestión para empresas retail de baterías y accesorios automotrices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64">
              {children}
              <div className="h-20 md:h-0" />
            </main>
          </div>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
