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
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #0a0d1a 50%, #1a0f3a 100%)'
    }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
            }}>
              <Zap size={24} color="white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            PoS Retail
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Plataforma de Gestión Automotriz</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 space-y-6 backdrop-blur-sm border" style={{
          background: 'rgba(26, 31, 58, 0.8)',
          borderColor: 'var(--border-light)',
          boxShadow: '0 25px 50px -12px rgba(0, 217, 255, 0.1)'
        }}>
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@posretail.com"
            />
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Selecciona tu Rol
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className="p-4 rounded-lg transition-all text-left text-sm border"
                  style={selectedRole === role.value ? {
                    background: `linear-gradient(135deg, rgba(0, 217, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)`,
                    borderColor: 'var(--primary)',
                    color: 'var(--text-primary)'
                  } : {
                    background: 'rgba(30, 41, 59, 0.5)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div className="font-semibold">{role.label}</div>
                  <div className="text-xs mt-1" style={{ opacity: 0.7 }}>{role.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 text-white hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              border: '1px solid var(--primary)'
            }}
          >
            <LogIn size={20} />
            {isLoading ? 'Iniciando...' : 'Ingresar'}
          </button>

          {/* Demo Info */}
          <div className="rounded-lg p-4 text-sm border" style={{
            background: 'rgba(0, 217, 255, 0.05)',
            borderColor: 'rgba(0, 217, 255, 0.2)',
            color: 'var(--primary)'
          }}>
            <p className="font-semibold mb-1">Información</p>
            <p>Prueba cada rol para explorar los módulos disponibles</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>© 2026 PoS Retail</p>
        </div>
      </div>
    </div>
  );
}
