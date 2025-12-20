export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  AUTHORIZED = 'authorized',
  IN_PROCESS = 'in_process',
  IN_MEDIATION = 'in_mediation',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  CHARGED_BACK = 'charged_back',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.APPROVED]: 'Aprobado',
  [PaymentStatus.AUTHORIZED]: 'Autorizado',
  [PaymentStatus.IN_PROCESS]: 'En Proceso',
  [PaymentStatus.IN_MEDIATION]: 'En Mediación',
  [PaymentStatus.REJECTED]: 'Rechazado',
  [PaymentStatus.CANCELLED]: 'Cancelado',
  [PaymentStatus.REFUNDED]: 'Reembolsado',
  [PaymentStatus.CHARGED_BACK]: 'Contracargo',
};
