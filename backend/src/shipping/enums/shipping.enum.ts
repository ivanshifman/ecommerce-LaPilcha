export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PICKUP = 'pickup',
}

export const SHIPPING_METHOD_LABELS: Record<ShippingMethod, string> = {
  [ShippingMethod.STANDARD]: 'Envío Estándar (5-7 días hábiles)',
  [ShippingMethod.EXPRESS]: 'Envío Express (2-3 días hábiles)',
  [ShippingMethod.PICKUP]: 'Retiro en Sucursal',
};

export enum ShippingStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
}

export const SHIPPING_STATUS_LABELS: Record<ShippingStatus, string> = {
  [ShippingStatus.PENDING]: 'Pendiente',
  [ShippingStatus.PREPARING]: 'Preparando Envío',
  [ShippingStatus.READY_FOR_PICKUP]: 'Listo para Retirar',
  [ShippingStatus.IN_TRANSIT]: 'En Tránsito',
  [ShippingStatus.OUT_FOR_DELIVERY]: 'En Reparto',
  [ShippingStatus.DELIVERED]: 'Entregado',
  [ShippingStatus.FAILED]: 'Fallido',
  [ShippingStatus.RETURNED]: 'Devuelto',
};

export enum ArgentinaProvince {
  BUENOS_AIRES = 'Buenos Aires',
  CAPITAL_FEDERAL = 'Capital Federal',
  CATAMARCA = 'Catamarca',
  CHACO = 'Chaco',
  CHUBUT = 'Chubut',
  CORDOBA = 'Córdoba',
  CORRIENTES = 'Corrientes',
  ENTRE_RIOS = 'Entre Ríos',
  FORMOSA = 'Formosa',
  JUJUY = 'Jujuy',
  LA_PAMPA = 'La Pampa',
  LA_RIOJA = 'La Rioja',
  MENDOZA = 'Mendoza',
  MISIONES = 'Misiones',
  NEUQUEN = 'Neuquén',
  RIO_NEGRO = 'Río Negro',
  SALTA = 'Salta',
  SAN_JUAN = 'San Juan',
  SAN_LUIS = 'San Luis',
  SANTA_CRUZ = 'Santa Cruz',
  SANTA_FE = 'Santa Fe',
  SANTIAGO_DEL_ESTERO = 'Santiago del Estero',
  TIERRA_DEL_FUEGO = 'Tierra del Fuego',
  TUCUMAN = 'Tucumán',
}

export enum ShippingZone {
  CABA = 'caba',
  GBA = 'gba',
  INTERIOR_BUENOS_AIRES = 'interior_buenos_aires',
  CENTRO = 'centro',
  CUYO = 'cuyo',
  NOA = 'noa',
  NEA = 'nea',
  PATAGONIA = 'patagonia',
}

export const PROVINCE_TO_ZONE: Record<ArgentinaProvince, ShippingZone> = {
  [ArgentinaProvince.CAPITAL_FEDERAL]: ShippingZone.CABA,
  [ArgentinaProvince.BUENOS_AIRES]: ShippingZone.GBA,
  [ArgentinaProvince.CORDOBA]: ShippingZone.CENTRO,
  [ArgentinaProvince.SANTA_FE]: ShippingZone.CENTRO,
  [ArgentinaProvince.ENTRE_RIOS]: ShippingZone.CENTRO,
  [ArgentinaProvince.MENDOZA]: ShippingZone.CUYO,
  [ArgentinaProvince.SAN_JUAN]: ShippingZone.CUYO,
  [ArgentinaProvince.SAN_LUIS]: ShippingZone.CUYO,
  [ArgentinaProvince.LA_RIOJA]: ShippingZone.CUYO,
  [ArgentinaProvince.SALTA]: ShippingZone.NOA,
  [ArgentinaProvince.JUJUY]: ShippingZone.NOA,
  [ArgentinaProvince.TUCUMAN]: ShippingZone.NOA,
  [ArgentinaProvince.CATAMARCA]: ShippingZone.NOA,
  [ArgentinaProvince.SANTIAGO_DEL_ESTERO]: ShippingZone.NOA,
  [ArgentinaProvince.CORRIENTES]: ShippingZone.NEA,
  [ArgentinaProvince.CHACO]: ShippingZone.NEA,
  [ArgentinaProvince.FORMOSA]: ShippingZone.NEA,
  [ArgentinaProvince.MISIONES]: ShippingZone.NEA,
  [ArgentinaProvince.NEUQUEN]: ShippingZone.PATAGONIA,
  [ArgentinaProvince.RIO_NEGRO]: ShippingZone.PATAGONIA,
  [ArgentinaProvince.CHUBUT]: ShippingZone.PATAGONIA,
  [ArgentinaProvince.SANTA_CRUZ]: ShippingZone.PATAGONIA,
  [ArgentinaProvince.TIERRA_DEL_FUEGO]: ShippingZone.PATAGONIA,
  [ArgentinaProvince.LA_PAMPA]: ShippingZone.INTERIOR_BUENOS_AIRES,
};
