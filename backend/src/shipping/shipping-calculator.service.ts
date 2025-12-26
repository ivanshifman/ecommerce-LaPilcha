import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingRate, ShippingRateDocument } from './schemas/shipping-rate.schema';
import {
  ShippingMethod,
  ShippingZone,
  PROVINCE_TO_ZONE,
  ArgentinaProvince,
} from './enums/shipping.enum';

export interface ShippingOption {
  method: ShippingMethod;
  methodLabel: string;
  cost: number;
  estimatedDays: string;
  isFree: boolean;
  description?: string;
}

@Injectable()
export class ShippingCalculatorService {
  constructor(
    @InjectModel(ShippingRate.name)
    private shippingRateModel: Model<ShippingRateDocument>,
  ) {}

  async calculateShipping(
    province: string,
    subtotal: number,
    weight?: number,
  ): Promise<ShippingOption[]> {
    const zone = this.getZoneFromProvince(province);

    const rates = await this.shippingRateModel
      .find({
        zone,
        isActive: true,
      })
      .exec();

    if (rates.length === 0) {
      throw new NotFoundException(`No hay tarifas de envío disponibles para ${province}`);
    }

    const options: ShippingOption[] = [];

    for (const rate of rates) {
      let cost = rate.basePrice;

      if (weight && rate.pricePerKg) {
        cost += weight * rate.pricePerKg;
      }

      const isFreeByThreshold =
        rate.freeShippingThreshold !== undefined &&
        rate.freeShippingThreshold > 0 &&
        subtotal >= rate.freeShippingThreshold;

      const isPickup = rate.method === ShippingMethod.PICKUP;

      const isFree = isFreeByThreshold || isPickup;

      if (isFree) {
        cost = 0;
      }

      const estimatedDays =
        rate.estimatedDaysMin === rate.estimatedDaysMax
          ? `${rate.estimatedDaysMin} días hábiles`
          : `${rate.estimatedDaysMin}-${rate.estimatedDaysMax} días hábiles`;

      options.push({
        method: rate.method,
        methodLabel: this.getMethodLabel(rate.method),
        cost,
        estimatedDays,
        isFree,
        description: rate.description,
      });
    }

    return options.sort((a, b) => a.cost - b.cost);
  }

  async getShippingCost(
    province: string,
    method: ShippingMethod,
    subtotal: number,
    weight?: number,
  ): Promise<number> {
    const zone = this.getZoneFromProvince(province);

    const rate = await this.shippingRateModel
      .findOne({
        zone,
        method,
        isActive: true,
      })
      .exec();

    if (!rate) {
      throw new NotFoundException(
        `No se encontró tarifa de envío para ${province} con método ${method}`,
      );
    }

    let cost = rate.basePrice;

    if (weight && rate.pricePerKg) {
      cost += weight * rate.pricePerKg;
    }

    const isFree =
      rate.freeShippingThreshold !== undefined &&
      rate.freeShippingThreshold > 0 &&
      subtotal >= rate.freeShippingThreshold;

    return isFree ? 0 : cost;
  }

  getZoneFromProvince(province: string): ShippingZone {
    const normalizedProvince = province.trim();

    const provinceEnum = Object.values(ArgentinaProvince).find(
      (p) => p.toLowerCase() === normalizedProvince.toLowerCase(),
    );

    if (!provinceEnum) {
      throw new NotFoundException(`Provincia inválida: ${province}`);
    }

    const zone = PROVINCE_TO_ZONE[provinceEnum];

    if (!zone) {
      throw new NotFoundException(`No hay zona configurada para la provincia ${province}`);
    }

    return zone;
  }

  private getMethodLabel(method: ShippingMethod): string {
    const labels: Record<ShippingMethod, string> = {
      [ShippingMethod.STANDARD]: 'Envío Estándar',
      [ShippingMethod.EXPRESS]: 'Envío Express',
      [ShippingMethod.PICKUP]: 'Retiro en Sucursal',
    };
    return labels[method];
  }

  async getAllRates(): Promise<ShippingRateDocument[]> {
    return this.shippingRateModel.find().sort({ zone: 1, method: 1 }).exec();
  }

  async createOrUpdateRate(data: {
    zone: ShippingZone;
    method: ShippingMethod;
    basePrice: number;
    pricePerKg?: number;
    freeShippingThreshold?: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
    description?: string;
  }): Promise<ShippingRateDocument> {
    const existing = await this.shippingRateModel
      .findOne({
        zone: data.zone,
        method: data.method,
      })
      .exec();

    if (existing) {
      Object.assign(existing, data);
      return existing.save();
    }

    const newRate = new this.shippingRateModel(data);
    return newRate.save();
  }

  async deleteRate(zone: ShippingZone, method: ShippingMethod): Promise<void> {
    await this.shippingRateModel.deleteOne({ zone, method }).exec();
  }

  async toggleRateStatus(
    zone: ShippingZone,
    method: ShippingMethod,
  ): Promise<ShippingRateDocument> {
    const rate = await this.shippingRateModel.findOne({ zone, method }).exec();
    if (!rate) {
      throw new NotFoundException('Tarifa no encontrada');
    }

    rate.isActive = !rate.isActive;
    return rate.save();
  }
}
