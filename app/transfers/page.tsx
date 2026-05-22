'use client';

import { useState } from 'react';
import { TRANSFER_REQUESTS } from '@/lib/data/mockData';
import { TransferRequest } from '@/lib/types';
import { ArrowRightLeft, CheckCircle, AlertCircle } from 'lucide-react';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<TransferRequest[]>(TRANSFER_REQUESTS);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusLabels = {
    requested: { label: 'Solicitada', color: 'bg-blue-500/20 text-blue-300' },
    approved: { label: 'Aprobada', color: 'bg-yellow-500/20 text-yellow-300' },
    in_transit: { label: 'En Tránsito', color: 'bg-purple-500/20 text-purple-300' },
    received: { label: 'Recibida', color: 'bg-green-500/20 text-green-300' },
    rejected: { label: 'Rechazada', color: 'bg-red-500/20 text-red-300' },
  };

  const filteredTransfers = transfers.filter(t =>
    !selectedStatus || t.status === selectedStatus
  );

  const handleApprove = (id: string) => {
    setTransfers(transfers.map(t =>
      t.id === id ? { ...t, status: 'approved' as const } : t
    ));
  };

  const handleSend = (id: string) => {
    setTransfers(transfers.map(t =>
      t.id === id ? { ...t, status: 'in_transit' as const } : t
    ));
  };

  const handleReceive = (id: string) => {
    setTransfers(transfers.map(t =>
      t.id === id ? { ...t, status: 'received' as const } : t
    ));
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Transferencias entre Tiendas</h1>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['', 'requested', 'approved', 'in_transit', 'received', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedStatus === status
                ? 'bg-violet-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {status === '' ? 'Todas' : statusLabels[status as keyof typeof statusLabels].label}
          </button>
        ))}
      </div>

      {/* Transferencias */}
      <div className="space-y-4">
        {filteredTransfers.map(transfer => (
          <div key={transfer.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-white">{transfer.transferNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[transfer.status].color}`}>
                    {statusLabels[transfer.status].label}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm mt-4">
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs">De</p>
                    <p className="text-white font-medium">{transfer.originStoreName}</p>
                  </div>
                  <ArrowRightLeft className="w-5 h-5 text-violet-500" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs">Para</p>
                    <p className="text-white font-medium">{transfer.destinationStoreName}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Producto</p>
                    <p className="text-white font-medium">{transfer.productName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Cantidad</p>
                    <p className="text-white font-bold text-lg">{transfer.quantity} unidades</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Solicitante</p>
                    <p className="text-white font-medium">{transfer.requesterName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Fecha</p>
                    <p className="text-white font-medium">{new Date(transfer.requestDate).toLocaleDateString('es-PE')}</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2">
                {transfer.status === 'requested' && (
                  <button
                    onClick={() => handleApprove(transfer.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    Aprobar
                  </button>
                )}
                {transfer.status === 'approved' && (
                  <button
                    onClick={() => handleSend(transfer.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    Despachar
                  </button>
                )}
                {transfer.status === 'in_transit' && (
                  <button
                    onClick={() => handleReceive(transfer.id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    Confirmar Recepción
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTransfers.length === 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay transferencias con este estado</p>
        </div>
      )}
    </div>
  );
}
