'use client';

import { useState } from 'react';
import { PRODUCTS, STORES } from '@/lib/data/mockData';
import { SaleItem, Sale } from '@/lib/types';
import { Search, Plus, Trash2, CheckCircle, X } from 'lucide-react';

export default function POSPage() {
  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [voucherType, setVoucherType] = useState<'boleta' | 'factura'>('boleta');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const addToCart = (product: typeof PRODUCTS[0], quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.productId === product.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.unitPrice }
          : item
      ));
    } else {
      setCartItems([...cartItems, {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        subtotal: product.price * quantity,
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.productId === productId
        ? { ...item, quantity, subtotal: quantity * item.unitPrice }
        : item
    ));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleCompleteSale = () => {
    if (cartItems.length === 0) {
      alert('Carrito vacío');
      return;
    }

    const newSale: Sale = {
      id: `sale_${Date.now()}`,
      saleNumber: `VTA-2026-${String(Math.random()).slice(2, 8)}`,
      storeId: STORES[0].id,
      vendorId: 'vendor_001',
      vendorName: 'Vendedor Demo',
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      items: cartItems,
      subtotal,
      tax,
      total,
      paymentMethod,
      saleDate: new Date().toISOString(),
      voucherType,
      sunatStatus: 'pending',
    };

    console.log('Venta completada:', newSale);
    setShowSuccess(true);
    setCartItems([]);
    setCustomerName('');
    setCustomerPhone('');

    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Punto de Venta</h1>
        <div className="text-sm text-gray-400">Caja: {STORES[0].name}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catálogo */}
        <div className="lg:col-span-2 space-y-4">
          {/* Búsqueda y Filtros */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === ''
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Todos
              </button>
              {['1', '2', '3', '4'].map(catId => (
                <button
                  key={catId}
                  onClick={() => setSelectedCategory(catId)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === catId
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {['Baterías', 'Aceites', 'Accesorios', 'Mantenimiento'][parseInt(catId) - 1]}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-violet-500 transition-colors">
                <div className="bg-gray-700 rounded h-24 flex items-center justify-center mb-3">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="text-sm font-semibold text-white truncate">{product.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{product.sku}</p>
                <p className="text-lg font-bold text-violet-400 mt-2">S/. {product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-3 bg-violet-600 hover:bg-violet-700 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 h-fit sticky top-4 space-y-4">
          <h2 className="text-xl font-bold text-white">Carrito</h2>

          <div className="bg-gray-700/30 rounded p-3 max-h-64 overflow-y-auto space-y-2">
            {cartItems.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Carrito vacío</p>
            ) : (
              cartItems.map(item => (
                <div key={item.productId} className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white truncate">{item.productName}</p>
                      <p className="text-xs text-gray-400">S/. {item.unitPrice}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                      className="w-12 bg-gray-600 text-white px-2 py-1 rounded text-xs text-center"
                    />
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs"
                    >
                      +
                    </button>
                    <span className="text-xs text-gray-300 ml-auto">
                      S/. {item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Resumen */}
          <div className="border-t border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal</span>
              <span className="text-white font-medium">S/. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">IGV (18%)</span>
              <span className="text-white font-medium">S/. {tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-700 pt-2 mt-2">
              <span className="text-white">Total</span>
              <span className="text-violet-400">S/. {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botón Cobrar */}
          <button
            onClick={() => setShowModal(true)}
            disabled={cartItems.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={20} />
            Cobrar y Generar Boleta
          </button>
        </div>
      </div>

      {/* Modal de Pago */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Completar Venta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Datos del Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Cliente (Opcional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="+51 999888777"
                />
              </div>

              {/* Tipo de Comprobante */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Comprobante</label>
                <div className="flex gap-2">
                  {(['boleta', 'factura'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setVoucherType(type)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        voucherType === type
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type === 'boleta' ? 'Boleta' : 'Factura'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Método de Pago</label>
                <div className="space-y-2">
                  {(['cash', 'card', 'transfer'] as const).map(method => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="w-4 h-4"
                      />
                      <span className="text-white">
                        {method === 'cash' ? '💵 Efectivo' : method === 'card' ? '💳 Tarjeta' : '🏦 Transferencia'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Resumen Final */}
              <div className="bg-gray-700/30 rounded p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white font-medium">S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">IGV (18%)</span>
                  <span className="text-white font-medium">S/. {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
                  <span className="text-white">Total a Pagar</span>
                  <span className="text-violet-400">S/. {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCompleteSale}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Confirmar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación de Éxito */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={20} />
          ✓ Venta completada exitosamente
        </div>
      )}
    </div>
  );
}
