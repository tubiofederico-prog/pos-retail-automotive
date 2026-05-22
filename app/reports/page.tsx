'use client';

import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [dateFrom, setDateFrom] = useState('2026-05-15');
  const [dateTo, setDateTo] = useState('2026-05-22');

  const salesData = [
    { date: '15 May', sales: 2400, transactions: 24 },
    { date: '16 May', sales: 3200, transactions: 32 },
    { date: '17 May', sales: 2100, transactions: 21 },
    { date: '18 May', sales: 4800, transactions: 48 },
    { date: '19 May', sales: 3500, transactions: 35 },
    { date: '20 May', sales: 4200, transactions: 42 },
    { date: '21 May', sales: 5100, transactions: 51 },
    { date: '22 May', sales: 3800, transactions: 38 },
  ];

  const inventoryData = [
    { category: 'Baterías', available: 156, lowStock: 12 },
    { category: 'Aceites', available: 234, lowStock: 8 },
    { category: 'Accesorios', available: 289, lowStock: 15 },
    { category: 'Mantenimiento', available: 167, lowStock: 5 },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Exportando reporte en formato ${format.toUpperCase()}`);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Reportes</h1>
      </div>

      {/* Tipo de Reporte */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'sales', label: 'Ventas' },
            { id: 'inventory', label: 'Inventario' },
            { id: 'cash', label: 'Caja' },
            { id: 'transfers', label: 'Transferencias' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                reportType === type.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Desde</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Hasta</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
              <Filter size={18} />
              Aplicar
            </button>
          </div>
        </div>
      </div>

      {reportType === 'sales' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard label="Venta Total" value="S/. 29,119" trend="+12%" />
            <KPICard label="Transacciones" value="291" trend="+8%" />
            <KPICard label="Ticket Promedio" value="S/. 100" trend="-2%" />
            <KPICard label="Crecimiento" value="+18%" trend="semanal" />
          </div>

          {/* Gráfico */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Ventas por Día</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="sales" stroke="#a855f7" strokeWidth={2} name="Ventas (S/.)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Detalle de Ventas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-300">Fecha</th>
                    <th className="px-4 py-2 text-right text-gray-300">Ventas</th>
                    <th className="px-4 py-2 text-right text-gray-300">Transacciones</th>
                    <th className="px-4 py-2 text-right text-gray-300">Ticket Prom.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {salesData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/30">
                      <td className="px-4 py-2 text-white">{row.date}</td>
                      <td className="px-4 py-2 text-right text-white font-bold">S/. {row.sales}</td>
                      <td className="px-4 py-2 text-right text-gray-300">{row.transactions}</td>
                      <td className="px-4 py-2 text-right text-gray-300">S/. {(row.sales / row.transactions).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {reportType === 'inventory' && (
        <div className="space-y-6">
          {/* Gráfico */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Stock por Categoría</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Bar dataKey="available" fill="#a855f7" name="Disponible" />
                <Bar dataKey="lowStock" fill="#ef4444" name="Stock Bajo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Botones de Exportación */}
      <div className="flex gap-2">
        <button
          onClick={() => handleExport('pdf')}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Download size={18} />
          Exportar PDF
        </button>
        <button
          onClick={() => handleExport('excel')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Download size={18} />
          Exportar Excel
        </button>
      </div>
    </div>
  );
}

function KPICard({ label, value, trend }: any) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <p className="text-white font-bold mt-2 text-lg">{value}</p>
      <p className="text-green-400 text-xs mt-1">{trend}</p>
    </div>
  );
}
