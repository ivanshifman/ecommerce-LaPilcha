export enum ReturnReason {
  DEFECTIVE = 'defective',
  WRONG_SIZE = 'wrong_size',
  WRONG_COLOR = 'wrong_color',
  NOT_AS_DESCRIBED = 'not_as_described',
  CHANGED_MIND = 'changed_mind',
  DAMAGED_IN_SHIPPING = 'damaged_in_shipping',
  DUPLICATE_ORDER = 'duplicate_order',
  OTHER = 'other',
}

export const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
  [ReturnReason.DEFECTIVE]: 'Producto Defectuoso',
  [ReturnReason.WRONG_SIZE]: 'Talle Incorrecto',
  [ReturnReason.WRONG_COLOR]: 'Color Incorrecto',
  [ReturnReason.NOT_AS_DESCRIBED]: 'No Coincide con la Descripción',
  [ReturnReason.CHANGED_MIND]: 'Cambié de Opinión',
  [ReturnReason.DAMAGED_IN_SHIPPING]: 'Dañado en Envío',
  [ReturnReason.DUPLICATE_ORDER]: 'Pedido Duplicado',
  [ReturnReason.OTHER]: 'Otro',
};

export enum ReturnResolution {
  FULL_REFUND = 'full_refund',
  PARTIAL_REFUND = 'partial_refund',
  EXCHANGE = 'exchange',
  STORE_CREDIT = 'store_credit',
  NONE = 'none',
}

export const RETURN_RESOLUTION_LABELS: Record<ReturnResolution, string> = {
  [ReturnResolution.FULL_REFUND]: 'Reembolso Completo',
  [ReturnResolution.PARTIAL_REFUND]: 'Reembolso Parcial',
  [ReturnResolution.EXCHANGE]: 'Cambio de Producto',
  [ReturnResolution.STORE_CREDIT]: 'Crédito en Tienda',
  [ReturnResolution.NONE]: 'Sin Resolución',
};
