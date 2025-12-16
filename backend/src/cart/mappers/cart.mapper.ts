import { CartItemResponseDto, CartResponseDto } from '../dto/cart-response.dto';
import { CartItemPopulated, CartPopulated } from '../types/cartPopuled.type';
import { DateFormatUtil } from '../../common/utils/date-format.util';

export class CartMapper {
  static toCartItemResponseDto(item: CartItemPopulated): CartItemResponseDto {
    const product = item.product;

    if (!product) {
      return {
        product: {
          id: '',
          name: 'Producto no disponible',
          price: 0,
          finalPrice: 0,
          status: false,
          color: '',
        },
        variant: item.variant,
        quantity: item.quantity,
        subtotal: 0,
        availableStock: 0,
        isAvailable: false,
      };
    }

    const discount = product.discount ?? 0;
    const finalPrice = product.price - product.price * (discount / 100);

    const availableStock = item.variant?.size
      ? (product.sizes.find((s) => s.size === item.variant?.size)?.stock ?? 0)
      : product.totalStock;

    const isAvailable = product.status === true && availableStock >= item.quantity;

    return {
      product: {
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        discount: product.discount,
        finalPrice,
        images: product.images,
        slug: product.slug,
        status: product.status ?? true,
        color: product.color,
        brand: product.brand,
      },
      variant: item.variant,
      quantity: item.quantity,
      subtotal: finalPrice * item.quantity,
      availableStock,
      isAvailable,
    };
  }

  static toCartResponseDto(cart: CartPopulated, isAnonymous: boolean): CartResponseDto {
    const items = cart.items.map((item) => CartMapper.toCartItemResponseDto(item));

    const availableItems = items.filter((i) => i.isAvailable);

    const subtotal = availableItems.reduce((sum, item) => sum + item.subtotal, 0);

    const discount = availableItems.reduce((sum, item) => {
      const original = item.product.price * item.quantity;
      return sum + (original - item.subtotal);
    }, 0);

    const total = subtotal;

    return {
      id: cart._id.toString(),
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      discount,
      total,
      isAnonymous,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      createdAtLocal: DateFormatUtil.toReadable(cart.createdAt),
      updatedAtLocal: DateFormatUtil.toReadable(cart.updatedAt),
    };
  }
}
