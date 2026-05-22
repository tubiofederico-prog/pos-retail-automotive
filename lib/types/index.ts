export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeId?: string;
  storeName?: string;
  avatar?: string;
}

export type UserRole = 'admin' | 'store_manager' | 'vendor' | 'delivery';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  manager: string;
  salesCount?: number;
  totalSales?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  description: string;
  image?: string;
  compatibility?: string;
}

export interface StockEntry {
  id: string;
  storeId: string;
  storeName: string;
  productId: string;
  quantity: number;
  minStock: number;
  lastUpdated: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  saleNumber: string;
  storeId: string;
  vendorId: string;
  vendorName: string;
  customerName?: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  saleDate: string;
  voucherType: 'boleta' | 'factura';
  sunatStatus: 'pending' | 'accepted' | 'rejected';
}

export interface TransferRequest {
  id: string;
  transferNumber: string;
  originStoreId: string;
  originStoreName: string;
  destinationStoreId: string;
  destinationStoreName: string;
  productId: string;
  productName: string;
  quantity: number;
  requestDate: string;
  status: 'requested' | 'approved' | 'in_transit' | 'received' | 'rejected';
  requesterName: string;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  type: 'home_delivery' | 'store_transfer';
  customerName?: string;
  customerPhone?: string;
  address?: string;
  productName?: string;
  quantity?: number;
  deliveryPersonName: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  assignedDate: string;
  saleId?: string;
  transferId?: string;
}

export interface CashBox {
  id: string;
  storeId: string;
  openingDate: string;
  closingDate?: string;
  openingBalance: number;
  closingBalance?: number;
  expectedTotal?: number;
  difference?: number;
  salesByMethod: {
    cash: number;
    card: number;
    transfer: number;
  };
}

export interface Invoice {
  id: string;
  number: string;
  type: 'boleta' | 'factura' | 'nota_credito' | 'guia';
  saleId: string;
  customerName?: string;
  customerRuc?: string;
  issueDate: string;
  totalAmount: number;
  sunatStatus: 'pending' | 'accepted' | 'rejected';
  errorMessage?: string;
}

export interface ERPSync {
  id: string;
  type: 'stock' | 'invoice' | 'payment';
  status: 'pending' | 'syncing' | 'success' | 'error';
  lastSync: string;
  nextRetry?: string;
  errorMessage?: string;
  recordsProcessed?: number;
}

export interface BatteryDiagnosis {
  id: string;
  diagnosticNumber: string;
  vendorName: string;
  customerName: string;
  customerPhone: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    licensePlate: string;
  };
  status: 'good' | 'discharged' | 'defective' | 'requires_change';
  observations: string;
  recommendedBattery: {
    productId: string;
    productName: string;
    price: number;
  };
  createdAt: string;
  convertedToSale?: boolean;
}

export interface DashboardKPI {
  label: string;
  value: string | number;
  trend?: number;
  icon?: string;
}
