import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { CouponUsage, CouponUsageDocument } from './schemas/coupon-usage.schema';
import { UserService } from '../user/user.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { CouponType, CouponStatus } from './enums/coupon-type.enum';

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponDocument;
  discountAmount: number;
  message?: string;
}

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<CouponDocument>,
    @InjectModel(CouponUsage.name) private couponUsageModel: Model<CouponUsageDocument>,
    private readonly userService: UserService,
  ) {}

  async create(dto: CreateCouponDto, adminId: string): Promise<CouponDocument> {
    const exists = await this.couponModel.findOne({ code: dto.code.toUpperCase() }).exec();
    if (exists) {
      throw new ConflictException('Ya existe un cupón con ese código');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    if (dto.type !== CouponType.FREE_SHIPPING && !dto.discountValue) {
      throw new BadRequestException('Debes especificar el valor del descuento');
    }

    if (dto.type === CouponType.PERCENTAGE && dto.discountValue && dto.discountValue > 100) {
      throw new BadRequestException('El porcentaje no puede ser mayor a 100');
    }

    const coupon = new this.couponModel({
      ...dto,
      code: dto.code.toUpperCase(),
      startDate,
      endDate,
      createdBy: new Types.ObjectId(adminId),
      usageCount: 0,
    });

    return await coupon.save();
  }

  async findAll(status?: CouponStatus): Promise<CouponDocument[]> {
    const filter = status ? { status } : {};
    return this.couponModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<CouponDocument> {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }
    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto): Promise<CouponDocument> {
    const coupon = await this.findById(id);

    if (dto.code && dto.code !== coupon.code) {
      const exists = await this.couponModel.findOne({ code: dto.code.toUpperCase() }).exec();
      if (exists) {
        throw new ConflictException('Ya existe un cupón con ese código');
      }
    }

    Object.assign(coupon, dto);
    if (dto.code) {
      coupon.code = dto.code.toUpperCase();
    }

    return await coupon.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.couponModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Cupón no encontrado');
    }
  }

  async validateCoupon(dto: ValidateCouponDto): Promise<CouponValidationResult> {
    const coupon = await this.couponModel
      .findOne({
        code: dto.code.toUpperCase(),
        status: CouponStatus.ACTIVE,
      })
      .exec();

    if (!coupon) {
      return {
        valid: false,
        discountAmount: 0,
        message: 'Cupón no válido o no existe',
      };
    }

    const now = new Date();
    if (now < coupon.startDate) {
      return {
        valid: false,
        discountAmount: 0,
        message: 'Este cupón aún no está disponible',
      };
    }

    if (now > coupon.endDate) {
      return {
        valid: false,
        discountAmount: 0,
        message: 'Este cupón ha expirado',
      };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return {
        valid: false,
        discountAmount: 0,
        message: 'Este cupón ya alcanzó su límite de usos',
      };
    }

    if (coupon.minPurchaseAmount && dto.orderTotal < coupon.minPurchaseAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Compra mínima de $${coupon.minPurchaseAmount} para usar este cupón`,
      };
    }

    if (coupon.firstPurchaseOnly && dto.userId) {
      const user = await this.userService.findById(dto.userId);
      if (user && user.totalOrders > 0) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Este cupón es solo para la primera compra',
        };
      }
    }

    if (dto.guestEmail && coupon.usageLimitPerUser) {
      const emailUsages = await this.couponUsageModel.countDocuments({
        coupon: coupon._id,
        guestEmail: dto.guestEmail.toLowerCase(),
      });

      if (emailUsages >= coupon.usageLimitPerUser) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Ya alcanzaste el límite de usos para este cupón',
        };
      }
    }

    if (dto.userId) {
      const userUsages = await this.couponUsageModel
        .countDocuments({
          coupon: coupon._id,
          user: new Types.ObjectId(dto.userId),
        })
        .exec();

      if (
        coupon.usageLimitPerUser &&
        coupon.usageLimitPerUser > 0 &&
        userUsages >= coupon.usageLimitPerUser
      ) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Ya alcanzaste el límite de usos para este cupón',
        };
      }
    }

    if (coupon.restrictedToUsers && coupon.restrictedToUsers.length > 0) {
      if (!dto.userId) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Debes iniciar sesión para usar este cupón',
        };
      }

      const isAllowed = coupon.restrictedToUsers.some((uid) => uid.toString() === dto.userId);

      if (!isAllowed) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Este cupón no está disponible para tu cuenta',
        };
      }
    }

    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      if (!dto.cartCategories || dto.cartCategories.length === 0) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Este cupón no aplica a los productos en tu carrito',
        };
      }

      const hasApplicableCategory = dto.cartCategories.some((cat) =>
        coupon.applicableCategories?.includes(cat),
      );

      if (!hasApplicableCategory) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Este cupón no aplica a las categorías en tu carrito',
        };
      }
    }

    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      if (!dto.cartProducts || dto.cartProducts.length === 0) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Este cupón no aplica a los productos en tu carrito',
        };
      }

      const hasApplicableProduct = dto.cartProducts.some((prodId) =>
        coupon.applicableProducts?.some((cpId) => cpId.toString() === prodId),
      );

      if (!hasApplicableProduct) {
        return {
          valid: false,
          discountAmount: 0,
          message: 'Este cupón no aplica a los productos en tu carrito',
        };
      }
    }

    let discountAmount = 0;

    switch (coupon.type) {
      case CouponType.PERCENTAGE:
        discountAmount = (dto.orderTotal * (coupon.discountValue || 0)) / 100;
        if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
          discountAmount = coupon.maxDiscountAmount;
        }
        break;

      case CouponType.FIXED_AMOUNT:
        discountAmount = coupon.discountValue || 0;
        if (discountAmount > dto.orderTotal) {
          discountAmount = dto.orderTotal;
        }
        break;

      case CouponType.FREE_SHIPPING:
        discountAmount = 0;
        break;
    }

    return {
      valid: true,
      coupon,
      discountAmount: Math.round(discountAmount * 100) / 100,
      message: 'Cupón aplicado exitosamente',
    };
  }

  async applyCoupon(
    couponCode: string,
    orderId: string,
    userId: string | undefined,
    guestEmail: string | undefined,
    discountApplied: number,
    orderTotal: number,
  ): Promise<void> {
    const coupon = await this.couponModel.findOne({ code: couponCode.toUpperCase() }).exec();

    if (!coupon) return;

    coupon.usageCount += 1;

    await coupon.save();

    const usage = new this.couponUsageModel({
      coupon: coupon._id,
      user: userId ? new Types.ObjectId(userId) : undefined,
      guestEmail: !userId ? guestEmail?.toLowerCase() : undefined,
      order: new Types.ObjectId(orderId),
      couponCode: coupon.code,
      discountApplied,
      orderTotal,
    });

    await usage.save();
  }

  async getCouponStats(couponId: string) {
    const coupon = await this.findById(couponId);

    const usages = await this.couponUsageModel.find({ coupon: couponId }).exec();

    const totalDiscount = usages.reduce((sum, usage) => sum + usage.discountApplied, 0);
    const totalRevenue = usages.reduce((sum, usage) => sum + usage.orderTotal, 0);

    return {
      coupon: {
        code: coupon.code,
        type: coupon.type,
        status: coupon.status,
      },
      usage: {
        total: coupon.usageCount,
        limit: coupon.usageLimit,
        remaining: coupon.usageLimit ? coupon.usageLimit - coupon.usageCount : null,
      },
      financial: {
        totalDiscount,
        totalRevenue,
        averageDiscount: usages.length > 0 ? totalDiscount / usages.length : 0,
      },
      dates: {
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        isActive: coupon.status === CouponStatus.ACTIVE,
        isExpired: new Date() > coupon.endDate,
      },
    };
  }

  async quickValidate(code: string): Promise<{ valid: boolean; message: string }> {
    const coupon = await this.couponModel
      .findOne({
        code: code.toUpperCase(),
        status: CouponStatus.ACTIVE,
      })
      .exec();

    if (!coupon) {
      return { valid: false, message: 'Cupón no encontrado' };
    }

    const now = new Date();

    if (now < coupon.startDate) {
      return { valid: false, message: 'Este cupón aún no está disponible' };
    }

    if (now > coupon.endDate) {
      return { valid: false, message: 'Este cupón ha expirado' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'Este cupón alcanzó su límite de usos' };
    }

    return { valid: true, message: 'Cupón válido' };
  }
}
