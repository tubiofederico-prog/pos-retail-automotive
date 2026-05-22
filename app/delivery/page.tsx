'use client';

import { useState } from 'react';
import { DELIVERIES } from '@/lib/data/mockData';
import { Delivery } from '@/lib/types';
import { Truck, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(DELIVERIES);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusLabels = {
    pending: { label: 'Pendiente', color: 'bg-blue-500/20 text-blue-300', icon: '⏳' },
    in_transit: { label: 'En Camino', color: 'bg-purple-500/20 text-purple-300', icon: '🚗' },
    delivered: { label: 'Entregado', color: 'bg-green-500/20 text-green-300', icon: '✓' },
    cancelled: { label: 'Cancelado', color: 'bg-red-500/20 text-red-300', icon: '✗' },
  };

  const filteredDeliveries = deliveries.filter(d =>
    !selectedStatus || d.status === selectedStatus
  );

  const handleStatusChange = (id: string, newStatus: Delivery['status']) => {
    setDeliveries(deliveries.map(d =>
      d.id === id ? { ...d, status: newStatus } : d
    ));
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Gestión de Entregas</h1>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'in_transit', 'delivered', 'cancelled'].map(status => (
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

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Total de Entregas"
          value={deliveries.length}
          icon="📦"
        />
        <KPICard
          label="Pendientes"
          value={deliveries.filter(d => d.status === 'pending').length}
          icon="⏳"
        />
        <KPICard
          label="En Tránsito"
          value={deliveries.filter(d => d.status === 'in_transit').length}
          icon="🚗"
        />
        <KPICard
          label="Entregadas"
          value={deliveries.filter(d => d.status === 'delivered').length}
          icon="✓"
        />
      </div>

      {/* Entregas */}
      <div className="space-y-4">
        {filteredDeliveries.map(delivery => (
          <div key={delivery.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-white">{delivery.deliveryNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[delivery.status].color}`}>
                    {statusLabels[delivery.status].icon} {statusLabels[delivery.status].label}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/50 text-gray-300">
                    {delivery.type === 'home_delivery' ? '🏠 A Domicilio' : '🏪 Transferencia'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                  {delivery.type === 'home_delivery' ? (
                    <>
                      <div>
                        <p className="text-gray-400 text-xs">Cliente</p>
                        <p className="text-white font-medium">{delivery.customerName}</p>
                        <p className="text-gray-400 text-xs">{delivery.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Dirección</p>
                        <p className="text-white font-medium flex items-start gap-2">
                          <MapPin size={14} className="mt-1 flex-shrink-0" />
                          {delivery.address}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-gray-400 text-xs">Destino</p>
                      <p className="text-white font-medium flex items-start gap-2">
                        <MapPin size={14} className="mt-1" />
                        {delivery.address}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-400 text-xs">Producto</p>
                    <p className="text-white font-medium">{delivery.productName}</p>
                    <p className="text-gray-400 text-xs">{delivery.quantity} unidades</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Repartidor</p>
                    <p className="text-white font-medium">{delivery.deliveryPersonName}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Asignado</p>
                    <p className="text-white font-medium">{new Date(delivery.assignedDate).toLocaleDateString('es-PE')}</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-2">
                {delivery.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(delivery.id, 'in_transit')}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                    >
                      Salir a Entregar
                    </button>
                    <button
                      onClick={() => handleStatusChange(delivery.id, 'cancelled')}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {delivery.status === 'in_transit' && (
                  <button
                    onClick={() => handleStatusChange(delivery.id, 'delivered')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
                  >
                    Marcar Entregado
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay entregas con este estado</p>
        </div>
      )}
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
