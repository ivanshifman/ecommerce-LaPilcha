// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import { ArrowLeft, ShoppingCart, CreditCard, Truck, MapPin, Tag, Shield, AlertCircle, Loader2 } from 'lucide-react';
// import { useCart, useCartActions } from '../../../store/cartStore';
// import { useAuth } from '../../../store/authStore';
// import { useCoupon, useCouponActions } from '../../../store/couponStore';
// import { useOrderActions } from '../../../store/orderStore';
// import { shippingService } from '../../../services/shipping.service';
// import { colorLabels } from '../../../utils/colorMap';
// import { showSuccess, showError } from '../../../lib/notifications';
// import { handleApiError } from '../../../api/error-handler';
// import { useRequireAuth } from '../../../hooks/useRequireAuth';
// import type { ShippingOption } from '../../../types/shipping.types';
// import { PaymentMethod, ShippingMethod } from '../../../types/order.types';

// export default function CheckoutPage() {
//     const router = useRouter();
//     const { isAuthenticated, isLoading: authLoading } = useRequireAuth();

//     const { cart, isLoading: cartLoading } = useCart();
//     const { user } = useAuth();
//     const { fetchCart } = useCartActions();
//     const { appliedCoupon, discountAmount, freeShipping } = useCoupon();
//     const { removeCoupon } = useCouponActions();
//     const { createOrder } = useOrderActions();

//     const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
//     const [loadingShipping, setLoadingShipping] = useState(false);

//     const [shippingForm, setShippingForm] = useState({
//         fullName: '',
//         phone: '',
//         address: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         additionalInfo: '',
//     });

//     const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(ShippingMethod.STANDARD);
//     const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MERCADO_PAGO);
//     const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({});

//     useEffect(() => {
//         if (user && isAuthenticated) {
//             fetchCart().catch(console.error);
//         }
//     }, [user, isAuthenticated, fetchCart]);

//     useEffect(() => {
//         if (!cart || cart.items.length === 0) {
//             router.push('/cart');
//         }
//     }, [cart, router]);

//     const calculateShippingOptions = async () => {
//         if (!shippingForm.state || !cart) return;

//         setLoadingShipping(true);
//         try {
//             const totalWeight = cart.items.reduce((sum, item) => {
//                 const weight = item.product.weight || 0.3;
//                 return sum + (weight * item.quantity);
//             }, 0);

//             const options = await shippingService.calculateShipping({
//                 province: shippingForm.state,
//                 subtotal: cart.total - discountAmount,
//                 weight: totalWeight,
//             });

//             setShippingOptions(options);
//         } catch (err) {
//             console.error('Error calculating shipping:', err);
//             setShippingOptions([]);
//         } finally {
//             setLoadingShipping(false);
//         }
//     };

//     useEffect(() => {
//         if (shippingForm.state && cart && step === 'shipping') {
//             const timer = setTimeout(() => {
//                 calculateShippingOptions();
//             }, 500);
//             return () => clearTimeout(timer);
//         }
//     }, [shippingForm.state, cart, step]);

//     const validateShippingForm = (): boolean => {
//         const errors: Record<string, string> = {};

//         if (!shippingForm.fullName.trim()) errors.fullName = 'Nombre completo es requerido';
//         if (!shippingForm.phone.trim()) errors.phone = 'Teléfono es requerido';
//         if (!shippingForm.address.trim()) errors.address = 'Dirección es requerida';
//         if (!shippingForm.city.trim()) errors.city = 'Ciudad es requerida';
//         if (!shippingForm.state.trim()) errors.state = 'Provincia es requerida';
//         if (!shippingForm.zipCode.trim()) errors.zipCode = 'Código postal es requerido';

//         setShippingErrors(errors);
//         return Object.keys(errors).length === 0;
//     };

//     const handleContinueToPayment = () => {
//         if (!validateShippingForm()) {
//             showError('Por favor completa todos los campos requeridos');
//             return;
//         }
//         setStep('payment');
//     };

//     const handlePlaceOrder = async () => {
//         if (!cart || cart.items.length === 0) {
//             showError('Tu carrito está vacío');
//             return;
//         }

//         setIsSubmitting(true);
//         try {
//             const order = await createOrder({
//                 items: cart.items.map(item => ({
//                     product: item.product.id,
//                     variant: item.variant,
//                     quantity: item.quantity,
//                 })),
//                 shippingAddress: {
//                     ...shippingForm,
//                     country: 'Argentina',
//                 },
//                 shippingMethod: selectedShippingMethod,
//                 paymentMethod: selectedPaymentMethod,
//                 couponCode: appliedCoupon?.code,
//             });

//             showSuccess('¡Orden creada exitosamente!');
//             removeCoupon();

//             // Redirect to order confirmation or payment
//             router.push(`/orders/${order.id}`);
//         } catch (err) {
//             const apiError = handleApiError(err);
//             showError(apiError.message || 'Error al crear la orden');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     if (authLoading || cartLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
//             </div>
//         );
//     }

//     if (!cart || cart.items.length === 0) {
//         return null;
//     }

//     const subtotal = cart.subtotal;
//     const cartDiscount = cart.discount;
//     const couponDiscount = discountAmount;
//     const totalAfterCoupon = cart.total - couponDiscount;

//     const selectedShipping = shippingOptions.find(
//         opt => opt.method.toLowerCase() === selectedShippingMethod.toLowerCase()
//     );
//     const shippingCost = freeShipping || selectedShipping?.isFree ? 0 : (selectedShipping?.cost || 0);

//     const finalTotal = totalAfterCoupon + shippingCost;

//     return (
//         <div className="min-h-screen bg-background">
//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <Link
//                         href="/cart"
//                         className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4"
//                     >
//                         <ArrowLeft className="w-4 h-4" />
//                         Volver al carrito
//                     </Link>
//                     <h1 className="text-3xl font-bold text-text-primary">Finalizar Compra</h1>
//                 </div>

//                 {/* Progress Steps */}
//                 <div className="mb-8">
//                     <div className="flex items-center justify-center gap-4">
//                         <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-primary' : 'text-success'}`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-primary text-white' : 'bg-success text-white'
//                                 }`}>
//                                 {step === 'payment' ? '✓' : '1'}
//                             </div>
//                             <span className="font-semibold hidden sm:inline">Envío</span>
//                         </div>
//                         <div className="h-0.5 w-16 sm:w-32 bg-border" />
//                         <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-primary' : 'text-text-muted'}`}>
//                             <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary text-white' : 'bg-muted text-text-muted'
//                                 }`}>
//                                 2
//                             </div>
//                             <span className="font-semibold hidden sm:inline">Pago</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Main Content */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {step === 'shipping' ? (
//                             <>
//                                 {/* Shipping Information */}
//                                 <div className="bg-white border border-border rounded-lg p-6">
//                                     <div className="flex items-center gap-2 mb-6">
//                                         <MapPin className="w-5 h-5 text-primary" />
//                                         <h2 className="text-xl font-bold text-text-primary">
//                                             Información de Envío
//                                         </h2>
//                                     </div>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div className="md:col-span-2">
//                                             <label className="block text-sm font-medium text-text-primary mb-2">
//                                                 Nombre Completo *
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={shippingForm.fullName}
//                                                 onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
//                                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${shippingErrors.fullName ? 'border-destructive' : 'border-border'
//                                                     }`}
//                                                 placeholder="Juan Pérez"
//                                             />
//                                             {shippingErrors.fullName && (
//                                                 <p className="text-sm text-destructive mt-1">{shippingErrors.fullName}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-text-primary mb-2">
//                                                 Teléfono *
//                                             </label>
//                                             <input
//                                                 type="tel"
//                                                 value={shippingForm.phone}
//                                                 onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
//                                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${shippingErrors.phone ? 'border-destructive' : 'border-border'
//                                                     }`}
//                                                 placeholder="+54 9 11 1234-5678"
//                                             />
//                                             {shippingErrors.phone && (
//                                                 <p className="text-sm text-destructive mt-1">{shippingErrors.phone}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-text-primary mb-2">
//                                                 Código Postal *
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={shippingForm.zipCode}
//                                                 onChange={(e) => setShippingForm({ ...shippingForm, zipCode: e.target.value })}
//                                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${shippingErrors.zipCode ? 'border-destructive' : 'border-border'
//                                                     }`}
//                                                 placeholder="1234"
//                                             />
//                                             {shippingErrors.zipCode && (
//                                                 <p className="text-sm text-destructive mt-1">{shippingErrors.zipCode}</p>
//                                             )}
//                                         </div>

//                                         <div className="md:col-span-2">
//                                             <label className="block text-sm font-medium text-text-primary mb-2">
//                                                 Dirección *
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={shippingForm.address}
//                                                 onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
//                                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${shippingErrors.address ? 'border-destructive' : 'border-border'
//                                                     }`}
//                                                 placeholder="Av. Corrientes 1234"
//                                             />
//                                             {shippingErrors.address && (
//                                                 <p className="text-sm text-destructive mt-1">{shippingErrors.address}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-text-primary mb-2">
//                                                 Ciudad *
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 value={shippingForm.city}
//                                                 onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
//                                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${shippingErrors.city ? 'border-destructive' : 'border-border'
//                                                     }`}
//                                                 placeholder="Buenos Aires"
//                                             />
//                                             {shippingErrors.city && (
//                                                 <p className="text-sm text-destructive mt-1">{shippingErrors.city}</p>
//                                             )}
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-text-primary mb-2">
//                                                 Provincia *
//                                             </label>
//                                             <select
//                                                 value={shippingForm.state}
//                                                 onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
//                                                 className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${shippingErrors.state ? 'border-destructive' : 'border-border'
//                                                     }`}
//                                                 title="Provincia"
//                                             >
//                                                 <option value="">Seleccionar...</option>
//                                                 <option value="Buenos Aires">Buenos Aires</option>
//                                                 <option value="CABA">CABA</option>
//                                                 <option value="Córdoba">Córdoba</option>
//                                                 <option value="Santa Fe">Santa Fe</option>
//                                                 <option value="Mendoza">Mendoza</option>
//                                             </select>
//                                             {shippingErrors.state && (
//                                                 <p className="text-sm text-destructive mt-1">{shippingErrors.state}</p>
//                                             )}
//                                         </div>

//                                         <div className="md:col-span-2">
//                                             <label className="block text-sm font-medium text-text-primary mb-2">
//                                                 Información Adicional
//                                             </label>
//                                             <textarea
//                                                 value={shippingForm.additionalInfo}
//                                                 onChange={(e) => setShippingForm({ ...shippingForm, additionalInfo: e.target.value })}
//                                                 className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
//                                                 rows={3}
//                                                 placeholder="Ej: Piso, departamento, referencias..."
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Shipping Methods */}
//                                 {shippingOptions.length > 0 && (
//                                     <div className="bg-white border border-border rounded-lg p-6">
//                                         <div className="flex items-center gap-2 mb-6">
//                                             <Truck className="w-5 h-5 text-primary" />
//                                             <h2 className="text-xl font-bold text-text-primary">
//                                                 Método de Envío
//                                             </h2>
//                                         </div>

//                                         <div className="space-y-3">
//                                             {shippingOptions.map((option) => (
//                                                 <label
//                                                     key={option.method}
//                                                     className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedShippingMethod.toLowerCase() === option.method.toLowerCase()
//                                                         ? 'border-primary bg-primary/5'
//                                                         : 'border-border hover:border-primary/50'
//                                                         }`}
//                                                 >
//                                                     <div className="flex items-center gap-4">
//                                                         <input
//                                                             type="radio"
//                                                             name="shipping"
//                                                             checked={selectedShippingMethod.toLowerCase() === option.method.toLowerCase()}
//                                                             onChange={() => setSelectedShippingMethod(option.method as ShippingMethod)}
//                                                             className="w-4 h-4 text-primary"
//                                                         />
//                                                         <div>
//                                                             <p className="font-semibold text-text-primary">{option.methodLabel}</p>
//                                                             <p className="text-sm text-text-muted">
//                                                                 {option.estimatedDays}
//                                                                 {option.description && ` • ${option.description}`}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                     <div className="text-right">
//                                                         <p className={`font-bold ${option.isFree ? 'text-success' : 'text-primary'}`}>
//                                                             {option.isFree || freeShipping ? '¡GRATIS!' : `$${option.cost.toFixed(2)}`}
//                                                         </p>
//                                                     </div>
//                                                 </label>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {loadingShipping && (
//                                     <div className="flex items-center justify-center gap-2 text-text-muted py-4">
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                         <span>Calculando opciones de envío...</span>
//                                     </div>
//                                 )}

//                                 <button
//                                     onClick={handleContinueToPayment}
//                                     disabled={!shippingForm.state || shippingOptions.length === 0}
//                                     className="w-full py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     Continuar al Pago
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 {/* Payment Method */}
//                                 <div className="bg-white border border-border rounded-lg p-6">
//                                     <div className="flex items-center gap-2 mb-6">
//                                         <CreditCard className="w-5 h-5 text-primary" />
//                                         <h2 className="text-xl font-bold text-text-primary">
//                                             Método de Pago
//                                         </h2>
//                                     </div>

//                                     <div className="space-y-3">
//                                         <label
//                                             className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === PaymentMethod.MERCADO_PAGO
//                                                 ? 'border-primary bg-primary/5'
//                                                 : 'border-border hover:border-primary/50'
//                                                 }`}
//                                         >
//                                             <div className="flex items-center gap-4">
//                                                 <input
//                                                     type="radio"
//                                                     name="payment"
//                                                     checked={selectedPaymentMethod === PaymentMethod.MERCADO_PAGO}
//                                                     onChange={() => setSelectedPaymentMethod(PaymentMethod.MERCADO_PAGO)}
//                                                     className="w-4 h-4 text-primary"
//                                                 />
//                                                 <div>
//                                                     <p className="font-semibold text-text-primary">Mercado Pago</p>
//                                                     <p className="text-sm text-text-muted">
//                                                         Tarjeta de crédito, débito, efectivo
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </label>

//                                         <label
//                                             className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === PaymentMethod.MODO
//                                                 ? 'border-primary bg-primary/5'
//                                                 : 'border-border hover:border-primary/50'
//                                                 }`}
//                                         >
//                                             <div className="flex items-center gap-4">
//                                                 <input
//                                                     type="radio"
//                                                     name="payment"
//                                                     checked={selectedPaymentMethod === PaymentMethod.MODO}
//                                                     onChange={() => setSelectedPaymentMethod(PaymentMethod.MODO)}
//                                                     className="w-4 h-4 text-primary"
//                                                 />
//                                                 <div>
//                                                     <p className="font-semibold text-text-primary">Modo</p>
//                                                     <p className="text-sm text-text-muted">
//                                                         Pago digital con CVU
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </label>
//                                     </div>

//                                     <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
//                                         <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
//                                         <div className="text-sm text-blue-800">
//                                             <p className="font-semibold mb-1">Información importante:</p>
//                                             <p>
//                                                 Serás redirigido a la plataforma de pago seleccionada para completar tu compra de forma segura.
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="flex gap-4">
//                                     <button
//                                         onClick={() => setStep('shipping')}
//                                         className="flex-1 py-4 border-2 border-primary text-primary rounded-lg font-semibold text-lg hover:bg-primary/5 transition-colors"
//                                     >
//                                         Volver
//                                     </button>
//                                     <button
//                                         onClick={handlePlaceOrder}
//                                         disabled={isSubmitting}
//                                         className="flex-1 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                                     >
//                                         {isSubmitting ? (
//                                             <>
//                                                 <Loader2 className="w-5 h-5 animate-spin" />
//                                                 Procesando...
//                                             </>
//                                         ) : (
//                                             'Confirmar Pedido'
//                                         )}
//                                     </button>
//                                 </div>
//                             </>
//                         )}
//                     </div>

//                     {/* Order Summary */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-white border border-border rounded-lg p-6 sticky top-24 space-y-4">
//                             <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
//                                 <ShoppingCart className="w-5 h-5" />
//                                 Resumen del Pedido
//                             </h2>

//                             <div className="space-y-3 max-h-60 overflow-y-auto">
//                                 {cart.items.map((item, index) => (
//                                     <div key={index} className="flex gap-3">
//                                         <div className="relative w-16 h-16 shrink-0">
//                                             <Image
//                                                 src={item.product.images?.[0] || '/imagen-no-disponible.webp'}
//                                                 alt={item.product.name}
//                                                 fill
//                                                 className="object-cover rounded"
//                                                 sizes="64px"
//                                             />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="text-sm font-medium text-text-primary line-clamp-1">
//                                                 {item.product.name}
//                                             </p>
//                                             {item.variant && (
//                                                 <p className="text-xs text-text-muted">
//                                                     {item.variant.size} • {item.variant.color && colorLabels[item.variant.color as keyof typeof colorLabels]}
//                                                 </p>
//                                             )}
//                                             <p className="text-sm text-text-muted">
//                                                 {item.quantity} x ${item.subtotal / item.quantity}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             <div className="space-y-2 pt-4 border-t border-border">
//                                 <div className="flex justify-between text-sm">
//                                     <span className="text-text-secondary">Subtotal:</span>
//                                     <span className="font-semibold">${subtotal.toFixed(2)}</span>
//                                 </div>

//                                 {cartDiscount > 0 && (
//                                     <div className="flex justify-between text-sm text-success">
//                                         <span>Descuentos:</span>
//                                         <span className="font-semibold">-${cartDiscount.toFixed(2)}</span>
//                                     </div>
//                                 )}

//                                 {couponDiscount > 0 && (
//                                     <div className="flex justify-between text-sm text-success">
//                                         <span className="flex items-center gap-1">
//                                             <Tag className="w-3 h-3" />
//                                             Cupón {appliedCoupon?.code}:
//                                         </span>
//                                         <span className="font-semibold">-${couponDiscount.toFixed(2)}</span>
//                                     </div>
//                                 )}

//                                 {step === 'payment' && (
//                                     <div className="flex justify-between text-sm">
//                                         <span className="text-text-secondary">Envío:</span>
//                                         <span className={`font-semibold ${shippingCost === 0 ? 'text-success' : ''}`}>
//                                             {shippingCost === 0 ? '¡GRATIS!' : `$${shippingCost.toFixed(2)}`}
//                                         </span>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
//                                     <span className="text-text-primary">Total:</span>
//                                     <span className="text-primary">${finalTotal.toFixed(2)}</span>
//                                 </div>
//                             </div>

//                             <div className="pt-4 border-t border-border space-y-3">
//                                 <div className="flex items-center gap-2 text-xs text-text-muted">
//                                     <Shield className="w-4 h-4 text-primary" />
//                                     <span>Pago 100% seguro</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 text-xs text-text-muted">
//                                     <Truck className="w-4 h-4 text-primary" />
//                                     <span>Envío con seguimiento</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }