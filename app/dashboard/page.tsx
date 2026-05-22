'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp, Package, Truck, DollarSign, Store } from 'lucide-react';
import { STORES, SALES, STOCK_ENTRIES, TRANSFER_REQUESTS, DELIVERIES } from '@/lib/data/mockData';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  if (!mounted || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  const salesData = [
    { day: 'Lun', sales: 2400 },
    { day: 'Mar', sales: 1398 },
    { day: 'Mié', sales: 9800 },
    { day: 'Jue', sales: 3908 },
    { day: 'Vie', sales: 4800 },
    { day: 'Sáb', sales: 3800 },
    { day: 'Dom', sales: 4300 },
  ];

  const storeData = STORES.map(store => ({
    name: store.name,
    sales: store.totalSales || 0,
  }));

  const categoryData = [
    { name: 'Baterías', value: 45 },
    { name: 'Aceites', value: 25 },
    { name: 'Accesorios', value: 20 },
    { name: 'Mantenimiento', value: 10 },
  ];

  const COLORS = ['#a855f7', '#3b82f6', '#06b6d4', '#f59e0b'];

  const lowStockProducts = STOCK_ENTRIES.filter(e => e.quantity < e.minStock);
  const pendingTransfers = TRANSFER_REQUESTS.filter(t => t.status === 'requested');
  const pendingDeliveries = DELIVERIES.filter(d => d.status === 'pending');

  const totalSales = SALES.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = SALES.length;
  const avgTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {user.storeName ? `Tienda: ${user.storeName}` : 'Vista General'}
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          icon={<DollarSign className="w-6 h-6" />}
          label="Venta Hoy"
          value={`S/. ${totalSales.toLocaleString('es-PE')}`}
          trend="+12%"
        />
        <KPICard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Transacciones"
          value={totalTransactions}
          trend="+5"
        />
        <KPICard
          icon={<Package className="w-6 h-6" />}
          label="Stock Bajo"
          value={lowStockProducts.length}
          trend="⚠️"
          isAlert={lowStockProducts.length > 0}
        />
        <KPICard
          icon={<Truck className="w-6 h-6" />}
          label="Entregas Pendientes"
          value={pendingDeliveries.length}
          trend="→"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ventas por Día */}
        <ChartCard title="Ventas por Día" fullWidth={false}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Line type="monotone" dataKey="sales" stroke="#a855f7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Ventas por Tienda */}
        <ChartCard title="Ventas por Tienda" fullWidth={false}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis stroke="#9ca3af" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="sales" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Ventas por Categoría */}
        <ChartCard title="Ventas por Categoría" fullWidth={false}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Alertas y Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Bajo */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Stock Bajo ({lowStockProducts.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin alertas de stock</p>
            ) : (
              lowStockProducts.map((entry) => (
                <div key={entry.id} className="bg-gray-700/30 p-3 rounded border border-red-500/20">
                  <p className="text-sm font-medium text-white">{entry.productId}</p>
                  <p className="text-xs text-gray-400">
                    {entry.storeName}: {entry.quantity} unidades (mín: {entry.minStock})
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transferencias Pendientes */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            Transferencias ({pendingTransfers.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pendingTransfers.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin transferencias pendientes</p>
            ) : (
              pendingTransfers.map((transfer) => (
                <div key={transfer.id} className="bg-gray-700/30 p-3 rounded border border-yellow-500/20">
                  <p className="text-sm font-medium text-white">{transfer.transferNumber}</p>
                  <p className="text-xs text-gray-400">
                    {transfer.originStoreName} → {transfer.destinationStoreName}
                  </p>
                  <p className="text-xs text-yellow-400 mt-1">{transfer.quantity} unidades</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Entregas en Curso */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-500" />
            Entregas en Curso
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pendingDeliveries.length === 0 ? (
              <p className="text-gray-400 text-sm">Sin entregas pendientes</p>
            ) : (
              pendingDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-gray-700/30 p-3 rounded border border-blue-500/20">
                  <p className="text-sm font-medium text-white">{delivery.deliveryNumber}</p>
                  <p className="text-xs text-gray-400">
                    {delivery.customerName || delivery.address}
                  </p>
                  <p className="text-xs text-blue-400 mt-1">Conductor: {delivery.deliveryPersonName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ventas Recientes */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ventas Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="text-left py-2 text-gray-400 font-medium">Número</th>
                <th className="text-left py-2 text-gray-400 font-medium">Cliente</th>
                <th className="text-left py-2 text-gray-400 font-medium">Vendedor</th>
                <th className="text-left py-2 text-gray-400 font-medium">Total</th>
                <th className="text-left py-2 text-gray-400 font-medium">Método</th>
                <th className="text-left py-2 text-gray-400 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {SALES.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="py-3 text-white font-medium">{sale.saleNumber}</td>
                  <td className="py-3 text-gray-300">{sale.customerName || '—'}</td>
                  <td className="py-3 text-gray-300">{sale.vendorName}</td>
                  <td className="py-3 text-white font-medium">S/. {sale.total}</td>
                  <td className="py-3">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300 capitalize">
                      {sale.paymentMethod === 'card' ? 'Tarjeta' : sale.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      sale.sunatStatus === 'accepted' ? 'bg-green-500/20 text-green-300' :
                      sale.sunatStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {sale.sunatStatus === 'accepted' ? '✓ Aceptado' : sale.sunatStatus === 'pending' ? '⏳ Pendiente' : '✗ Rechazado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  icon,
  label,
  value,
  trend,
  isAlert,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  isAlert?: boolean;
}) {
  return (
    <div className={`bg-gray-800 rounded-lg p-6 border ${isAlert ? 'border-red-500/30' : 'border-gray-700'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-xs sm:text-sm font-medium">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${isAlert ? 'bg-red-500/20 text-red-500' : 'bg-violet-500/20 text-violet-400'}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <p className={`text-xs mt-3 font-medium ${isAlert ? 'text-red-400' : 'text-green-400'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}

function ChartCard({
  title,
  children,
  fullWidth = true,
}: {
  title: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 p-6 ${!fullWidth ? 'lg:col-span-1' : ''}`}>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
