'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { UserRole } from '@/lib/types';
import { LogIn, Zap } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@posretail.com');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [isLoading, setIsLoading] = useState(false);

  const roles: { value: UserRole; label: string; description: string; emoji: string }[] = [
    {
      value: 'admin',
      label: 'Administrador',
      description: 'Acceso total al sistema',
      emoji: '👨‍💼',
    },
    {
      value: 'store_manager',
      label: 'Encargado de Tienda',
      description: 'Gestión de tienda',
      emoji: '🏪',
    },
    {
      value: 'vendor',
      label: 'Vendedor/Técnico',
      description: 'POS y diagnósticos',
      emoji: '👨‍🔧',
    },
    {
      value: 'delivery',
      label: 'Repartidor',
      description: 'Entregas',
      emoji: '🚗',
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(email, 'demo', selectedRole);
      router.push('/dashboard');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-10 h-10 text-violet-500" />
            <h1 className="text-3xl font-bold text-white">PoS Retail</h1>
          </div>
          <p className="text-gray-400">Sistema de Punto de Venta Automotriz</p>
        </div>

        {/* Card */}
        <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-8 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email de Demo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="demo@posretail.com"
            />
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Selecciona tu rol:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedRole === role.value
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                  }`}
                >
                  <div className="text-2xl mb-2">{role.emoji}</div>
                  <div className="text-sm font-medium text-white">{role.label}</div>
                  <div className="text-xs text-gray-400 mt-1">{role.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            {isLoading ? 'Iniciando...' : 'Ingresar al Sistema'}
          </button>

          {/* Demo Info */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
            <p className="font-semibold mb-1">💡 Demo</p>
            <p>Prueba diferentes roles para ver los módulos disponibles para cada usuario.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2026 PoS Retail. Solución de Punto de Venta Automotriz</p>
        </div>
      </div>
    </div>
  );
}
