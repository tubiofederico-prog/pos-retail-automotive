'use client';

import { useState } from 'react';
import { BatteryDiagnosis } from '@/lib/types';
import { PRODUCTS, BATTERY_DIAGNOSTICS } from '@/lib/data/mockData';
import { Zap, Plus, CheckCircle, X } from 'lucide-react';

export default function DiagnosisPage() {
  const [diagnostics, setDiagnostics] = useState<BatteryDiagnosis[]>(BATTERY_DIAGNOSTICS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    vehicleMake: 'Toyota',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    status: 'good' as 'good' | 'discharged' | 'defective' | 'requires_change',
    observations: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<BatteryDiagnosis | null>(null);

  const statusLabels = {
    good: { label: 'Batería Buena ✓', color: 'bg-green-500/20 text-green-300', emoji: '✓' },
    discharged: { label: 'Batería Descargada ⚠️', color: 'bg-yellow-500/20 text-yellow-300', emoji: '⚠️' },
    defective: { label: 'Batería Defectuosa ✗', color: 'bg-red-500/20 text-red-300', emoji: '✗' },
    requires_change: { label: 'Cambio Requerido 🔄', color: 'bg-orange-500/20 text-orange-300', emoji: '🔄' },
  };

  const statusToRecommendedBattery = (status: string) => {
    if (status === 'requires_change' || status === 'discharged') {
      return PRODUCTS[0];
    }
    return PRODUCTS[1];
  };

  const handleCreateDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();

    const recommendedBattery = statusToRecommendedBattery(formData.status);

    const newDiagnosis: BatteryDiagnosis = {
      id: `diag_${Date.now()}`,
      diagnosticNumber: `DGN-2026-${String(Math.random()).slice(2, 8)}`,
      vendorName: 'Vendedor Demo',
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      vehicleInfo: {
        make: formData.vehicleMake,
        model: formData.vehicleModel,
        year: formData.vehicleYear,
        licensePlate: formData.licensePlate,
      },
      status: formData.status,
      observations: formData.observations,
      recommendedBattery: {
        productId: recommendedBattery.id,
        productName: recommendedBattery.name,
        price: recommendedBattery.price,
      },
      createdAt: new Date().toISOString(),
      convertedToSale: false,
    };

    setDiagnostics([newDiagnosis, ...diagnostics]);
    setShowSuccess(true);
    setFormData({
      customerName: '',
      customerPhone: '',
      vehicleMake: 'Toyota',
      vehicleModel: '',
      vehicleYear: '',
      licensePlate: '',
      status: 'good',
      observations: '',
    });
    setShowForm(false);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleConvertToSale = (diagnostic: BatteryDiagnosis) => {
    setDiagnostics(diagnostics.map(d =>
      d.id === diagnostic.id ? { ...d, convertedToSale: true } : d
    ));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Diagnóstico de Batería</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nuevo Diagnóstico
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Crear Diagnóstico</h2>
          <form onSubmit={handleCreateDiagnosis} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="+51 999888777"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Marca Vehículo</label>
                <select
                  value={formData.vehicleMake}
                  onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option>Toyota</option>
                  <option>Honda</option>
                  <option>Nissan</option>
                  <option>Mazda</option>
                  <option>Suzuki</option>
                  <option>Ford</option>
                  <option>Chevrolet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleModel}
                  onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Corolla"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Año</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleYear}
                  onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="2015"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Placa</label>
                <input
                  type="text"
                  required
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="ABC-123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Estado de Batería</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(['good', 'discharged', 'defective', 'requires_change'] as const).map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, status })}
                    className={`p-3 rounded-lg font-medium transition-colors ${
                      formData.status === status
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {statusLabels[status].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Observaciones</label>
              <textarea
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={3}
                placeholder="Detalles técnicos del diagnóstico..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Guardar Diagnóstico
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Diagnósticos */}
      <div className="space-y-4">
        {diagnostics.map(diagnostic => (
          <div
            key={diagnostic.id}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{diagnostic.diagnosticNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[diagnostic.status].color}`}>
                    {statusLabels[diagnostic.status].label}
                  </span>
                  {diagnostic.convertedToSale && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                      ✓ Convertido
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Cliente</p>
                    <p className="text-white font-medium">{diagnostic.customerName}</p>
                    <p className="text-gray-400 text-xs">{diagnostic.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Vehículo</p>
                    <p className="text-white font-medium">{diagnostic.vehicleInfo.make} {diagnostic.vehicleInfo.model}</p>
                    <p className="text-gray-400 text-xs">{diagnostic.vehicleInfo.year} • {diagnostic.vehicleInfo.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Fecha</p>
                    <p className="text-white font-medium">{new Date(diagnostic.createdAt).toLocaleDateString('es-PE')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Batería Recomendada</p>
                    <p className="text-white font-medium">{diagnostic.recommendedBattery.productName}</p>
                    <p className="text-violet-400 text-xs">S/. {diagnostic.recommendedBattery.price}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-400 text-xs mb-1">Observaciones</p>
                  <p className="text-gray-200 text-sm">{diagnostic.observations}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {!diagnostic.convertedToSale && (
                  <button
                    onClick={() => handleConvertToSale(diagnostic)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                  >
                    <CheckCircle size={18} />
                    Vender
                  </button>
                )}
                <button
                  onClick={() => setSelectedDiagnostic(selectedDiagnostic?.id === diagnostic.id ? null : diagnostic)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  {selectedDiagnostic?.id === diagnostic.id ? 'Cerrar' : 'Ver'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notificación de Éxito */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={20} />
          ✓ Diagnóstico guardado exitosamente
        </div>
      )}
    </div>
  );
}
