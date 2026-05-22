'use client';

import { useState } from 'react';
import { Zap, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ERPPage() {
  const [syncStatus, setSyncStatus] = useState<Record<string, any>>({
    stock: { status: 'success', lastSync: '2026-05-22 14:32', recordsProcessed: 245 },
    invoices: { status: 'success', lastSync: '2026-05-22 14:28', recordsProcessed: 12 },
    payments: { status: 'pending', nextRetry: '2026-05-22 14:45' },
  });

  const statusColors = {
    success: 'bg-green-500/20 text-green-300',
    pending: 'bg-yellow-500/20 text-yellow-300',
    error: 'bg-red-500/20 text-red-300',
    syncing: 'bg-blue-500/20 text-blue-300',
  };

  const statusIcons = {
    success: <CheckCircle className="w-5 h-5" />,
    pending: <AlertTriangle className="w-5 h-5" />,
    error: <AlertTriangle className="w-5 h-5" />,
    syncing: <RefreshCw className="w-5 h-5 animate-spin" />,
  };

  const handleRetry = (key: string) => {
    setSyncStatus(prev => ({
      ...prev,
      [key]: { ...prev[key], status: 'syncing' }
    }));
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        [key]: { ...prev[key], status: 'success', lastSync: new Date().toLocaleString('es-PE') }
      }));
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Integración ERP/SAP</h1>
        <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <RefreshCw size={18} />
          Sincronizar Ahora
        </button>
      </div>

      {/* Flujo de Datos */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-6">Flujo de Sincronización</h3>
        <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
          <div className="bg-violet-600/20 border border-violet-500/30 rounded-lg p-4 text-center">
            <p className="text-violet-300 font-medium">🖥️ PoS Local</p>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-blue-300 font-medium">☁️ API Gateway</p>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 text-center">
            <p className="text-green-300 font-medium">🏢 SAP ERP</p>
          </div>
        </div>
      </div>

      {/* Estado de Sincronización */}
      <div className="space-y-4">
        {Object.entries(syncStatus).map(([key, data]) => (
          <div key={key} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-white capitalize">
                    {key === 'stock' ? 'Sincronización de Stock' : key === 'invoices' ? 'Sincronización de Facturas' : 'Sincronización de Pagos'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusColors[data.status as keyof typeof statusColors]}`}>
                    {statusIcons[data.status as keyof typeof statusIcons]}
                    {data.status === 'success' ? 'Exitoso' : data.status === 'syncing' ? 'Sincronizando...' : data.status === 'pending' ? 'Pendiente' : 'Error'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Último Sync</p>
                    <p className="text-white font-medium">{data.lastSync || data.nextRetry}</p>
                  </div>
                  {data.recordsProcessed && (
                    <div>
                      <p className="text-gray-400 text-xs">Registros Procesados</p>
                      <p className="text-white font-medium">{data.recordsProcessed}</p>
                    </div>
                  )}
                  {data.errorMessage && (
                    <div className="md:col-span-2">
                      <p className="text-gray-400 text-xs">Error</p>
                      <p className="text-red-400 font-medium">{data.errorMessage}</p>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {data.status === 'syncing' && (
                  <div className="mt-4">
                    <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full w-2/3 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {data.status !== 'syncing' && (
                  <button
                    onClick={() => handleRetry(key)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <RefreshCw size={16} />
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Historial */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Historial de Sincronizaciones</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg text-sm">
            <div>
              <p className="text-white font-medium">Stock - 245 productos</p>
              <p className="text-gray-400 text-xs">2026-05-22 14:32 • 2 minutos</p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-300">✓ OK</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg text-sm">
            <div>
              <p className="text-white font-medium">Facturas - 12 comprobantes</p>
              <p className="text-gray-400 text-xs">2026-05-22 14:28 • 6 minutos</p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-300">✓ OK</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg text-sm">
            <div>
              <p className="text-white font-medium">Pagos - 5 movimientos</p>
              <p className="text-gray-400 text-xs">2026-05-22 14:10 • Error en validación</p>
            </div>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/20 text-red-300">✗ ERROR</span>
          </div>
        </div>
      </div>

      {/* Configuración */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Configuración</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
            <span className="text-gray-300">URL del Servidor SAP</span>
            <span className="text-white font-mono text-sm">sap.empresa.com:8080</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
            <span className="text-gray-300">Intervalo de Sincronización</span>
            <span className="text-white font-medium">5 minutos</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
            <span className="text-gray-300">Último Reinicio</span>
            <span className="text-white font-medium">Hoy a las 6:32 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
