'use client';

import { useState } from 'react';
import { STOCK_ENTRIES, PRODUCTS, STORES } from '@/lib/data/mockData';
import { AlertCircle, Plus, MapPin } from 'lucide-react';

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferData, setTransferData] = useState({
    productId: '',
    quantity: 1,
    destinationStoreId: '',
  });

  const filteredStock = STOCK_ENTRIES.filter(entry => {
    const product = PRODUCTS.find(p => p.id === entry.productId);
    const matchCategory = !selectedCategory || product?.category === selectedCategory;
    const matchStore = !selectedStore || entry.storeId === selectedStore;
    return matchCategory && matchStore;
  });

  const totalStock = filteredStock.reduce((sum, entry) => sum + entry.quantity, 0);
  const lowStockCount = filteredStock.filter(e => e.quantity < e.minStock).length;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Solicitud de transferencia enviada: ${transferData.quantity} unidades`);
    setTransferData({ productId: '', quantity: 1, destinationStoreId: '' });
    setShowTransferForm(false);
  };

  const getNearbyStores = (currentStoreId: string) => {
    return STORES.filter(s => s.id !== currentStoreId).slice(0, 2);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Inventario por Tienda</h1>
        <button
          onClick={() => setShowTransferForm(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Solicitar Transferencia
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard label="Stock Total" value={totalStock} icon="📦" />
        <KPICard label="Bajo Stock" value={lowStockCount} icon="⚠️" isAlert={lowStockCount > 0} />
        <KPICard label="Productos" value={PRODUCTS.length} icon="🏷️" />
      </div>

      {/* Filtros */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-4">
        <h3 className="text-sm font-semibold text-gray-300">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Todas</option>
              <option value="1">Baterías</option>
              <option value="2">Aceites</option>
              <option value="3">Accesorios</option>
              <option value="4">Mantenimiento</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Tienda</label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Todas</option>
              {STORES.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Stock */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50 border-b border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Producto</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">SKU</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Tienda</th>
                <th className="px-4 py-3 text-right text-gray-300 font-semibold">Stock</th>
                <th className="px-4 py-3 text-right text-gray-300 font-semibold">Mín.</th>
                <th className="px-4 py-3 text-center text-gray-300 font-semibold">Estado</th>
                <th className="px-4 py-3 text-center text-gray-300 font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredStock.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No hay productos que coincidan con los filtros
                  </td>
                </tr>
              ) : (
                filteredStock.map((entry) => {
                  const product = PRODUCTS.find(p => p.id === entry.productId);
                  const isLowStock = entry.quantity < entry.minStock;

                  return (
                    <tr key={entry.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{product?.name}</td>
                      <td className="px-4 py-3 text-gray-400">{product?.sku}</td>
                      <td className="px-4 py-3 text-gray-400">{entry.storeName}</td>
                      <td className="px-4 py-3 text-right text-white font-bold">{entry.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-400">{entry.minStock}</td>
                      <td className="px-4 py-3 text-center">
                        {isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300">
                            <AlertCircle size={14} />
                            Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                            ✓ OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setTransferData({
                              productId: entry.productId,
                              quantity: 1,
                              destinationStoreId: '',
                            });
                            setShowTransferForm(true);
                          }}
                          className="text-violet-400 hover:text-violet-300 font-medium text-xs"
                        >
                          Solicitar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Transferencia */}
      {showTransferForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Solicitar Transferencia</h2>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Producto</label>
                <select
                  value={transferData.productId}
                  onChange={(e) => setTransferData({ ...transferData, productId: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Selecciona un producto</option>
                  {PRODUCTS.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={transferData.quantity}
                  onChange={(e) => setTransferData({ ...transferData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tienda Destino</label>
                <select
                  value={transferData.destinationStoreId}
                  onChange={(e) => setTransferData({ ...transferData, destinationStoreId: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="">Selecciona tienda</option>
                  {STORES.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransferForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, icon, isAlert }: any) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border ${isAlert ? 'border-red-500/30' : 'border-gray-700'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
