import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ShippingCalculatorService } from '../shipping/shipping-calculator.service';
import { ShippingMethod, ShippingZone } from '../shipping/enums/shipping.enum';

async function seedShippingRates() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const shippingService = app.get(ShippingCalculatorService);

  const rates = [
    // CABA
    {
      zone: ShippingZone.CABA,
      method: ShippingMethod.STANDARD,
      basePrice: 3000,
      pricePerKg: 500,
      freeShippingThreshold: 50000,
      estimatedDaysMin: 2,
      estimatedDaysMax: 4,
      description: 'Envío estándar a Capital Federal',
    },
    {
      zone: ShippingZone.CABA,
      method: ShippingMethod.EXPRESS,
      basePrice: 5000,
      pricePerKg: 800,
      freeShippingThreshold: 80000,
      estimatedDaysMin: 1,
      estimatedDaysMax: 2,
      description: 'Envío express a Capital Federal',
    },
    {
      zone: ShippingZone.CABA,
      method: ShippingMethod.PICKUP,
      basePrice: 0,
      pricePerKg: 0,
      freeShippingThreshold: 0,
      estimatedDaysMin: 1,
      estimatedDaysMax: 2,
      description: 'Retiro a conveniencia (CABA)',
    },

    // GBA (Gran Buenos Aires)
    {
      zone: ShippingZone.GBA,
      method: ShippingMethod.STANDARD,
      basePrice: 4000,
      pricePerKg: 600,
      freeShippingThreshold: 50000,
      estimatedDaysMin: 3,
      estimatedDaysMax: 5,
      description: 'Envío estándar a GBA',
    },
    {
      zone: ShippingZone.GBA,
      method: ShippingMethod.EXPRESS,
      basePrice: 6500,
      pricePerKg: 1000,
      freeShippingThreshold: 80000,
      estimatedDaysMin: 2,
      estimatedDaysMax: 3,
      description: 'Envío express a GBA',
    },

    // Interior Buenos Aires
    {
      zone: ShippingZone.INTERIOR_BUENOS_AIRES,
      method: ShippingMethod.STANDARD,
      basePrice: 5000,
      pricePerKg: 700,
      freeShippingThreshold: 60000,
      estimatedDaysMin: 4,
      estimatedDaysMax: 7,
      description: 'Envío estándar al interior de Buenos Aires',
    },

    // Centro (Córdoba, Santa Fe, Entre Ríos)
    {
      zone: ShippingZone.CENTRO,
      method: ShippingMethod.STANDARD,
      basePrice: 6000,
      pricePerKg: 800,
      freeShippingThreshold: 70000,
      estimatedDaysMin: 5,
      estimatedDaysMax: 8,
      description: 'Envío estándar a zona Centro',
    },

    // Cuyo (Mendoza, San Juan, San Luis, La Rioja)
    {
      zone: ShippingZone.CUYO,
      method: ShippingMethod.STANDARD,
      basePrice: 7000,
      pricePerKg: 900,
      freeShippingThreshold: 80000,
      estimatedDaysMin: 6,
      estimatedDaysMax: 10,
      description: 'Envío estándar a Cuyo',
    },

    // NOA (Salta, Jujuy, Tucumán, Catamarca, Santiago del Estero)
    {
      zone: ShippingZone.NOA,
      method: ShippingMethod.STANDARD,
      basePrice: 7500,
      pricePerKg: 1000,
      freeShippingThreshold: 80000,
      estimatedDaysMin: 6,
      estimatedDaysMax: 10,
      description: 'Envío estándar al NOA',
    },

    // NEA (Corrientes, Chaco, Formosa, Misiones)
    {
      zone: ShippingZone.NEA,
      method: ShippingMethod.STANDARD,
      basePrice: 7500,
      pricePerKg: 1000,
      freeShippingThreshold: 80000,
      estimatedDaysMin: 6,
      estimatedDaysMax: 10,
      description: 'Envío estándar al NEA',
    },

    // Patagonia (Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego)
    {
      zone: ShippingZone.PATAGONIA,
      method: ShippingMethod.STANDARD,
      basePrice: 9000,
      pricePerKg: 1200,
      freeShippingThreshold: 100000,
      estimatedDaysMin: 7,
      estimatedDaysMax: 12,
      description: 'Envío estándar a Patagonia',
    },
  ];

  console.log('🚀 Iniciando seed de tarifas de envío...');

  for (const rate of rates) {
    try {
      await shippingService.createOrUpdateRate(rate);
      console.log(`✅ Creada tarifa: ${rate.zone} - ${rate.method}`);
    } catch (error) {
      console.error(`❌ Error creando tarifa ${rate.zone} - ${rate.method}:`, error);
    }
  }

  console.log('✅ Seed completado');
  await app.close();
}

seedShippingRates()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  });
