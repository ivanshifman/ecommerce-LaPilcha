import { IsEnum, IsMongoId } from 'class-validator';
import { PaymentMethod } from '../../order/enums/payment-method.enum';

export class CreatePaymentDto {
  @IsMongoId({ message: 'El ID de la orden no es válido' })
  orderId!: string;

  @IsEnum(PaymentMethod, { message: 'Método de pago no válido' })
  method!: PaymentMethod;
}
