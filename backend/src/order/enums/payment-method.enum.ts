export enum PaymentMethod {
  MERCADO_PAGO = 'mercado_pago',
  MODO = 'modo',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.MERCADO_PAGO]: 'Mercado Pago',
  [PaymentMethod.MODO]: 'Modo',
};
