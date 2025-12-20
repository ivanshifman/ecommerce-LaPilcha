export interface MercadoPagoWebhookPayload {
  data?: {
    id?: string;
  };
}

export interface MercadoPagoWebhookHeaders {
  signature?: string;
  requestId?: string;
}
