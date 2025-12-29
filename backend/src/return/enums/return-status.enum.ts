export enum ReturnStatus {
  REQUESTED = 'requested',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SHIPPING = 'shipping',
  RECEIVED = 'received',
  INSPECTING = 'inspecting',
  APPROVED_REFUND = 'approved_refund',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const RETURN_STATUS_LABELS: Record<ReturnStatus, string> = {
  [ReturnStatus.REQUESTED]: 'Solicitada',
  [ReturnStatus.PENDING_APPROVAL]: 'Pendiente de Aprobación',
  [ReturnStatus.APPROVED]: 'Aprobada',
  [ReturnStatus.REJECTED]: 'Rechazada',
  [ReturnStatus.SHIPPING]: 'En Envío de Retorno',
  [ReturnStatus.RECEIVED]: 'Recibida en Almacén',
  [ReturnStatus.INSPECTING]: 'En Inspección',
  [ReturnStatus.APPROVED_REFUND]: 'Aprobada para Reembolso',
  [ReturnStatus.REFUNDED]: 'Reembolsada',
  [ReturnStatus.COMPLETED]: 'Completada',
  [ReturnStatus.CANCELLED]: 'Cancelada',
};
