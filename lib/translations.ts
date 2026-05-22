export const roleTranslations: Record<string, string> = {
  admin: 'Administrador',
  store_manager: 'Encargado de Tienda',
  vendor: 'Vendedor/Técnico',
  delivery: 'Repartidor',
};

export const statusTranslations: Record<string, string> = {
  good: 'Buena',
  discharged: 'Descargada',
  defective: 'Defectuosa',
  requires_change: 'Requiere Cambio',
  pending: 'Pendiente',
  in_transit: 'En Tránsito',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  requested: 'Solicitada',
  approved: 'Aprobada',
  received: 'Recibida',
  rejected: 'Rechazada',
  home_delivery: 'A Domicilio',
  store_transfer: 'Transferencia',
  accepted: 'Aceptado',
};

export const paymentMethodTranslations: Record<string, string> = {
  cash: '💵 Efectivo',
  card: '💳 Tarjeta',
  transfer: '🏦 Transferencia',
};

export const voucherTypeTranslations: Record<string, string> = {
  boleta: 'Boleta',
  factura: 'Factura',
  nota_credito: 'Nota de Crédito',
  guia: 'Guía de Remisión',
};

export const roleEmojis: Record<string, string> = {
  admin: '👨‍💼',
  store_manager: '🏪',
  vendor: '👨‍🔧',
  delivery: '🚗',
};

export function getRoleLabel(role: string): string {
  return roleTranslations[role] || role;
}

export function getStatusLabel(status: string): string {
  return statusTranslations[status] || status;
}

export function getPaymentMethodLabel(method: string): string {
  return paymentMethodTranslations[method] || method;
}

export function getVoucherTypeLabel(type: string): string {
  return voucherTypeTranslations[type] || type;
}
