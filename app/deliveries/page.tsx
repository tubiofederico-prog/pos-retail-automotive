'use client';

import { useState } from 'react';
import { DELIVERIES } from '@/lib/data/mockData';
import { Delivery } from '@/lib/types';
import { MapPin, Phone, CheckCircle, AlertCircle, Navigation } from 'lucide-react';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(DELIVERIES);

  const handleStartDelivery = (id: string) => {
    setDeliveries(deliveries.map(d =>
      d.id === id ? { ...d, status: 'in_transit' } : d
    ));
  };

  const handleCompleteDelivery = (id: string) => {
    setDeliveries(deliveries.map(d =>
      d.id === id ? { ...d, status: 'delivered' } : d
    ));
  };

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending');
  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit');
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className="p-4 md:p-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white">Mis Entregas</h1>

      {/* KPIs Mobile Friendly */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <KPICard label="Pendientes" value={pendingDeliveries.length} color="bg-blue-500/20" />
        <KPICard label="En Ruta" value={activeDeliveries.length} color="bg-purple-500/20" />
        <KPICard label="Completadas" value={completedDeliveries.length} color="bg-green-500/20" />
      </div>

      {/* Entregas Pendientes */}
      {pendingDeliveries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Por Entregar</h2>
          {pendingDeliveries.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStart={() => handleStartDelivery(delivery.id)}
            />
          ))}
        </div>
      )}

      {/* Entregas Activas */}
      {activeDeliveries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">En Camino</h2>
          {activeDeliveries.map(delivery => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onComplete={() => handleCompleteDelivery(delivery.id)}
            />
          ))}
        </div>
      )}

      {/* Entregas Completadas */}
      {completedDeliveries.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Completadas</h2>
          {completedDeliveries.map(delivery => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      )}

      {deliveries.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-400">¡Todas las entregas completadas!</p>
        </div>
      )}
    </div>
  );
}

function DeliveryCard({
  delivery,
  onStart,
  onComplete,
}: {
  delivery: Delivery;
  onStart?: () => void;
  onComplete?: () => void;
}) {
  const statusColors = {
    pending: 'border-blue-500/30 bg-blue-500/5',
    in_transit: 'border-purple-500/30 bg-purple-500/5',
    delivered: 'border-green-500/30 bg-green-500/5',
    cancelled: 'border-red-500/30 bg-red-500/5',
  };

  const statusIcons = {
    pending: '⏳',
    in_transit: '🚗',
    delivered: '✓',
    cancelled: '✗',
  };

  return (
    <div className={`bg-gray-800 rounded-lg border ${statusColors[delivery.status]} p-4 space-y-3`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{statusIcons[delivery.status]}</span>
            <p className="font-bold text-white text-sm md:text-base">{delivery.deliveryNumber}</p>
          </div>

          {delivery.type === 'home_delivery' ? (
            <>
              <p className="text-sm text-white font-medium">{delivery.customerName}</p>
              <div className="flex items-start gap-2 text-xs text-gray-300 mt-1">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{delivery.address}</p>
                  {delivery.customerPhone && (
                    <a href={`tel:${delivery.customerPhone}`} className="text-blue-400 flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      {delivery.customerPhone}
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2 text-xs text-gray-300">
                <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                <span>{delivery.address}</span>
              </div>
            </>
          )}

          <p className="text-xs text-gray-400 mt-2">
            📦 {delivery.productName} • {delivery.quantity} unidades
          </p>
        </div>
      </div>

      {/* Acciones */}
      {delivery.status === 'pending' && onStart && (
        <button
          onClick={onStart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Navigation size={16} />
          Iniciar Entrega
        </button>
      )}

      {delivery.status === 'in_transit' && onComplete && (
        <button
          onClick={onComplete}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <CheckCircle size={16} />
          Marcar Entregado
        </button>
      )}

      {delivery.status === 'delivered' && (
        <div className="text-center text-xs text-green-400 font-medium">
          ✓ Entregado
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, color }: any) {
  return (
    <div className={`${color} rounded-lg p-3 text-center border border-gray-600`}>
      <p className="text-gray-300 text-xs">{label}</p>
      <p className="text-white font-bold text-lg mt-1">{value}</p>
    </div>
  );
}
