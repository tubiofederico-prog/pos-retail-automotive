'use client';

import { useState } from 'react';
import { INVOICES } from '@/lib/data/mockData';
import { Invoice } from '@/lib/types';
import { FileText, DownloadCloud, AlertCircle } from 'lucide-react';

export default function InvoicingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [selectedType, setSelectedType] = useState<string>('');

  const typeLabels = {
    boleta: 'Boleta',
    factura: 'Factura',
    nota_credito: 'Nota de Crédito',
    guia: 'Guía de Remisión',
  };

  const statusLabels = {
    pending: { label: 'Pendiente', color: 'bg-yellow-500/20 text-yellow-300', icon: '⏳' },
    accepted: { label: 'Aceptado', color: 'bg-green-500/20 text-green-300', icon: '✓' },
    rejected: { label: 'Rechazado', color: 'bg-red-500/20 text-red-300', icon: '✗' },
  };

  const filteredInvoices = invoices.filter(inv =>
    !selectedType || inv.type === selectedType
  );

  const handleResend = (id: string) => {
    setInvoices(invoices.map(inv =>
      inv.id === id ? { ...inv, sunatStatus: 'pending' } : inv
    ));
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Facturas Electrónicas (SUNAT)</h1>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Total Comprobantes"
          value={invoices.length}
          icon="📄"
        />
        <KPICard
          label="Aceptados"
          value={invoices.filter(i => i.sunatStatus === 'accepted').length}
          icon="✓"
        />
        <KPICard
          label="Pendientes"
          value={invoices.filter(i => i.sunatStatus === 'pending').length}
          icon="⏳"
        />
        <KPICard
          label="Rechazados"
          value={invoices.filter(i => i.sunatStatus === 'rejected').length}
          icon="✗"
        />
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['', 'boleta', 'factura', 'nota_credito', 'guia'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedType === type
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {type === '' ? 'Todas' : typeLabels[type as keyof typeof typeLabels]}
          </button>
        ))}
      </div>

      {/* Tabla de Comprobantes */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-700/50 border-b border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Número</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Tipo</th>
                <th className="px-4 py-3 text-left text-gray-300 font-semibold">Cliente</th>
                <th className="px-4 py-3 text-right text-gray-300 font-semibold">Monto</th>
                <th className="px-4 py-3 text-center text-gray-300 font-semibold">Estado SUNAT</th>
                <th className="px-4 py-3 text-center text-gray-300 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{invoice.number}</td>
                  <td className="px-4 py-3 text-gray-300">
                    {typeLabels[invoice.type as keyof typeof typeLabels]}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {invoice.customerName}
                    {invoice.customerRuc && <p className="text-xs text-gray-400">RUC: {invoice.customerRuc}</p>}
                  </td>
                  <td className="px-4 py-3 text-right text-white font-bold">
                    S/. {invoice.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                      statusLabels[invoice.sunatStatus].color
                    }`}>
                      {statusLabels[invoice.sunatStatus].icon} {statusLabels[invoice.sunatStatus].label}
                    </span>
                    {invoice.errorMessage && (
                      <p className="text-xs text-red-400 mt-1">⚠️ {invoice.errorMessage}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleResend(invoice.id)}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                        title="Reenviar a SUNAT"
                      >
                        Reenviar
                      </button>
                      <button className="text-green-400 hover:text-green-300 text-xs font-medium"
                        title="Descargar PDF"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info SUNAT */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-300 mb-1">Integración SUNAT</p>
          <p className="text-sm text-blue-200">
            Los comprobantes se sincronizan automáticamente cada 5 minutos. Los estados se actualizan en tiempo real.
          </p>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon }: any) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}
