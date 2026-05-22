'use client';

import { useState } from 'react';
import { STORES, PRODUCTS } from '@/lib/data/mockData';
import { Store, Product } from '@/lib/types';
import { Plus, Edit2, Trash2, Settings } from 'lucide-react';

export default function AdminPage() {
  const [adminTab, setAdminTab] = useState<'stores' | 'products' | 'users' | 'config'>('stores');
  const [stores] = useState<Store[]>(STORES);
  const [products] = useState<Product[]>(PRODUCTS);

  const users = [
    { id: '1', name: 'Carlos Mendoza', email: 'carlos@posretail.com', role: 'Vendedor', store: 'Lima Norte' },
    { id: '2', name: 'Ana García', email: 'ana@posretail.com', role: 'Encargada', store: 'Lima Sur' },
    { id: '3', name: 'Miguel Rodríguez', email: 'miguel@posretail.com', role: 'Repartidor', store: 'Callao' },
  ];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-white">Administración del Sistema</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        {['stores', 'products', 'users', 'config'].map(tab => (
          <button
            key={tab}
            onClick={() => setAdminTab(tab as any)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              adminTab === tab
                ? 'border-violet-600 text-violet-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab === 'stores' && '🏪 Tiendas'}
            {tab === 'products' && '📦 Productos'}
            {tab === 'users' && '👥 Usuarios'}
            {tab === 'config' && '⚙️ Configuración'}
          </button>
        ))}
      </div>

      {/* Tiendas */}
      {adminTab === 'stores' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Gestión de Tiendas</h2>
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <Plus size={18} />
              Nueva Tienda
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Ciudad</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Encargado</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Teléfono</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {stores.map(store => (
                  <tr key={store.id} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-white font-medium">{store.name}</td>
                    <td className="px-4 py-3 text-gray-300">{store.city}</td>
                    <td className="px-4 py-3 text-gray-300">{store.manager}</td>
                    <td className="px-4 py-3 text-gray-300">{store.phone}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Productos */}
      {adminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Gestión de Productos</h2>
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <Plus size={18} />
              Nuevo Producto
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">SKU</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">Categoría</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Precio</th>
                  <th className="px-4 py-3 text-right text-gray-300 font-semibold">Costo</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-white font-medium">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-300">{product.name}</td>
                    <td className="px-4 py-3 text-center text-gray-300 text-xs">
                      {['Baterías', 'Aceites', 'Accesorios', 'Mantenimiento'][parseInt(product.category) - 1]}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-bold">S/. {product.price}</td>
                    <td className="px-4 py-3 text-right text-gray-300">S/. {product.cost}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Usuarios */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Gestión de Usuarios</h2>
            <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
              <Plus size={18} />
              Nuevo Usuario
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50 border-b border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Rol</th>
                  <th className="px-4 py-3 text-left text-gray-300 font-semibold">Tienda</th>
                  <th className="px-4 py-3 text-center text-gray-300 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-700/30">
                    <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-gray-300">{user.email}</td>
                    <td className="px-4 py-3 text-gray-300">{user.role}</td>
                    <td className="px-4 py-3 text-gray-300">{user.store}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Configuración */}
      {adminTab === 'config' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Configuración del Sistema</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfigCard title="Comprobantes" items={[
              { label: 'Series Boletas', value: 'BOL-001 a BOL-999' },
              { label: 'Series Facturas', value: 'FAC-001 a FAC-999' },
              { label: 'Correlativo Actual', value: 'BOL-035' },
            ]} />

            <ConfigCard title="Stock" items={[
              { label: 'Stock Mínimo Default', value: '5 unidades' },
              { label: 'Alerta de Bajo Stock', value: 'Habilitada' },
              { label: 'Revalorización', value: 'Mensual' },
            ]} />

            <ConfigCard title="Tiendas Cercanas" items={[
              { label: 'Radio de Búsqueda', value: '15 km' },
              { label: 'Tiendas Mostradas', value: 'Hasta 5' },
              { label: 'Orden', value: 'Por distancia' },
            ]} />

            <ConfigCard title="Integración SUNAT" items={[
              { label: 'Estado', value: 'Conectado ✓' },
              { label: 'Sincronización', value: 'Cada 5 minutos' },
              { label: 'Último Sync', value: 'Hace 2 minutos' },
            ]} />
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigCard({ title, items }: any) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
            <span className="text-gray-300">{item.label}</span>
            <span className="text-white font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
