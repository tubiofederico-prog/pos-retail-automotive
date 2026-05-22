'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function CashPage() {
  const [cashBoxOpen, setCashBoxOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(5000);

  const salesData = {
    cash: 3245.50,
    card: 5678.90,
    transfer: 2345.00,
  };

  const totalExpected = openingBalance + Object.values(salesData).reduce((a, b) => a + b, 0);
  const actualTotal = totalExpected - 50;
  const difference = actualTotal - totalExpected;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Gestión de Caja</h1>
        <button
          onClick={() => setCashBoxOpen(!cashBoxOpen)}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            cashBoxOpen
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {cashBoxOpen ? 'Cerrar Caja' : 'Abrir Caja'}
        </button>
      </div>

      {/* Estado de Caja */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${cashBoxOpen ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          <p className="text-lg font-bold text-white">
            {cashBoxOpen ? 'CAJA ABIERTA' : 'CAJA CERRADA'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <KPICard label="Saldo Inicial" value={`S/. ${openingBalance.toFixed(2)}`} />
          <KPICard label="Total Efectivo" value={`S/. ${salesData.cash.toFixed(2)}`} />
          <KPICard label="Total Tarjeta" value={`S/. ${salesData.card.toFixed(2)}`} />
          <KPICard label="Total Transferencia" value={`S/. ${salesData.transfer.toFixed(2)}`} />
        </div>
      </div>

      {/* Resumen de Ventas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Desglose por Método de Pago</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-white font-medium">Efectivo</span>
              </div>
              <span className="text-white font-bold">S/. {salesData.cash.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span className="text-white font-medium">Tarjeta</span>
              </div>
              <span className="text-white font-bold">S/. {salesData.card.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-purple-500" />
                <span className="text-white font-medium">Transferencia</span>
              </div>
              <span className="text-white font-bold">S/. {salesData.transfer.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Total Vendido</span>
              <span className="text-2xl font-bold text-violet-400">
                S/. {Object.values(salesData).reduce((a, b) => a + b, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Cierre de Caja */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Resumen de Cierre</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
              <span className="text-gray-300">Saldo Inicial</span>
              <span className="text-white font-medium">S/. {openingBalance.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded">
              <span className="text-gray-300">+ Ventas del Día</span>
              <span className="text-white font-medium">
                S/. {Object.values(salesData).reduce((a, b) => a + b, 0).toFixed(2)}
              </span>
            </div>

            <div className="border-t border-gray-600 my-2" />

            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded border border-gray-600">
              <span className="text-white font-bold">Total Esperado</span>
              <span className="text-white font-bold text-lg">S/. {totalExpected.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded border border-gray-600">
              <span className="text-white font-bold">Total Real (Contado)</span>
              <span className="text-white font-bold text-lg">S/. {actualTotal.toFixed(2)}</span>
            </div>

            <div className={`flex justify-between items-center p-3 rounded border ${
              Math.abs(difference) < 1
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-red-500/20 border-red-500/30'
            }`}>
              <span className={`font-bold ${
                Math.abs(difference) < 1 ? 'text-green-300' : 'text-red-300'
              }`}>Diferencia</span>
              <span className={`font-bold text-lg ${
                Math.abs(difference) < 1 ? 'text-green-300' : 'text-red-300'
              }`}>
                {difference >= 0 ? '+' : ''}S/. {difference.toFixed(2)}
              </span>
            </div>
          </div>

          {cashBoxOpen && (
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mt-4">
              Generar Reporte de Cierre
            </button>
          )}
        </div>
      </div>

      {/* Historial */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Últimas Operaciones</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded text-sm">
              <span className="text-gray-300">Venta #{1001 + i}</span>
              <span className="text-white font-medium">S/. {(1000 + i * 50).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value }: any) {
  return (
    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <p className="text-white font-bold mt-2">{value}</p>
    </div>
  );
}
