// app/terms/page.tsx
import Link from 'next/link';
import { FileText, AlertCircle, Package, CreditCard, Truck, RefreshCw } from 'lucide-react';
import { COMPANY_INFO, CONTACT_INFO } from '../../../lib/constants/contact';

export const metadata = {
    title: 'Términos y Condiciones | La Pilcha',
    description: 'Términos y condiciones de uso del sitio web y servicio de La Pilcha',
};

export default function TermsPage() {
    const lastUpdate = "Enero 2026";

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="bg-campo-gradient border-b border-border">
                <div className="max-w-4xl mx-auto px-4 py-16 md:py-20">
                    <div className="flex items-center justify-center mb-6">
                        <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-center">
                        Términos y Condiciones
                    </h1>
                    <p className="text-center text-text-secondary">
                        Última actualización: {lastUpdate}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-12">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                        <div className="text-sm text-text-primary">
                            <p className="font-semibold mb-2">Información Importante</p>
                            <p>
                                Al utilizar nuestro sitio web y realizar compras, aceptás los siguientes términos y condiciones.
                                Te recomendamos leerlos detenidamente. Si tenés alguna duda, podés contactarnos en{' '}
                                <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">
                                    {CONTACT_INFO.email}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            1. Información General
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                El presente documento establece los Términos y Condiciones (en adelante, "T&C") que regulan
                                el uso del sitio web <strong>lapilcha.com.ar</strong> (en adelante, el "Sitio") y la compra
                                de productos ofrecidos por <strong>{COMPANY_INFO.name}</strong>, {COMPANY_INFO.legalName}
                                (en adelante, "La Pilcha", "nosotros" o "nuestro").
                            </p>
                            <p>
                                <strong>Datos del titular del sitio:</strong>
                            </p>
                            <div className="bg-white border border-border rounded-lg p-6">
                                <ul className="space-y-2 list-none">
                                    <li><strong>Razón Social:</strong> {COMPANY_INFO.legalName}</li>
                                    <li><strong>CUIT:</strong> {COMPANY_INFO.taxId}</li>
                                    <li><strong>Domicilio Legal:</strong> {CONTACT_INFO.address}</li>
                                    <li><strong>Email:</strong> {CONTACT_INFO.email}</li>
                                    <li><strong>Teléfono:</strong> {CONTACT_INFO.phone}</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            2. Aceptación de los Términos
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Al acceder y utilizar este Sitio, el usuario (en adelante, "el Usuario" o "vos")
                                aceptás estar sujeto a estos T&C, todas las leyes y regulaciones aplicables de la
                                República Argentina, en particular:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Ley 24.240 de Defensa del Consumidor y sus modificatorias</li>
                                <li>Ley 25.326 de Protección de Datos Personales</li>
                                <li>Código Civil y Comercial de la Nación</li>
                                <li>Ley 27.078 de Tecnologías de la Información y las Comunicaciones</li>
                            </ul>
                            <p>
                                Si no estás de acuerdo con alguno de estos términos, no deberás utilizar este Sitio
                                ni realizar compras a través del mismo.
                            </p>
                            <p>
                                La utilización del Sitio y/o la realización de compras implica la aceptación plena
                                y sin reservas de estos T&C.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            3. Capacidad Legal para Contratar
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Los servicios de {COMPANY_INFO.name} están disponibles únicamente para personas que
                                tengan capacidad legal para contratar conforme a lo dispuesto por el Código Civil y
                                Comercial de la Nación.
                            </p>
                            <p>
                                No podrán utilizar los servicios:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Menores de 18 años de edad</li>
                                <li>Personas declaradas incapaces o con capacidad restringida sin la debida autorización</li>
                                <li>Personas inhabilitadas para contratar</li>
                            </ul>
                            <p>
                                Al aceptar estos T&C, declarás bajo juramento que tenés capacidad legal para contratar.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            4. Registro y Cuenta de Usuario
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">4.1. Creación de Cuenta</h3>
                            <p>
                                Para realizar compras, es necesario crear una cuenta proporcionando información
                                veraz, exacta, completa y actualizada. Sos responsable de mantener la confidencialidad
                                de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">4.2. Obligaciones del Usuario</h3>
                            <p>Al crear una cuenta, te comprometés a:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Proporcionar información verdadera, precisa y completa</li>
                                <li>Mantener y actualizar dicha información</li>
                                <li>No compartir tu cuenta con terceros</li>
                                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
                                <li>Ser responsable de todas las actividades realizadas bajo tu cuenta</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">4.3. Suspensión de Cuenta</h3>
                            <p>
                                Nos reservamos el derecho de suspender o cancelar cuentas en caso de:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Incumplimiento de estos T&C</li>
                                <li>Proporcionar información falsa o fraudulenta</li>
                                <li>Uso indebido de la plataforma</li>
                                <li>Actividad sospechosa de fraude</li>
                                <li>Solicitud del propio Usuario</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Package className="w-6 h-6" />
                            5. Productos y Servicios
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">5.1. Catálogo de Productos</h3>
                            <p>
                                Ofrecemos una variedad de productos de indumentaria, calzado y accesorios de campo.
                                Las imágenes de los productos son ilustrativas y pueden variar ligeramente respecto
                                al producto real debido a configuraciones de pantalla o fotografía.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">5.2. Disponibilidad y Stock</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Todos los productos están sujetos a disponibilidad de stock
                                </li>
                                <li>
                                    Nos reservamos el derecho de descontinuar productos en cualquier momento
                                </li>
                                <li>
                                    En caso de falta de stock después de confirmar tu pedido, te notificaremos
                                    inmediatamente y te ofreceremos alternativas o la devolución del dinero
                                </li>
                                <li>
                                    La publicación de un producto no constituye una oferta vinculante hasta la
                                    confirmación del pedido
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">5.3. Descripción de Productos</h3>
                            <p>
                                Nos esforzamos por proporcionar descripciones precisas de nuestros productos,
                                incluyendo materiales, talles, colores y características. Sin embargo, no garantizamos
                                que las descripciones sean completamente exactas, completas o libres de errores.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">5.4. Talles y Medidas</h3>
                            <p>
                                Proporcionamos guías de talles como referencia. Te recomendamos consultarlas antes
                                de realizar tu compra. Las variaciones de hasta 2cm en las medidas se consideran
                                normales debido a procesos de fabricación.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                            <CreditCard className="w-6 h-6" />
                            6. Precios y Facturación
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">6.1. Moneda y Precios</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Todos los precios están expresados en <strong>pesos argentinos (ARS)</strong></li>
                                <li>Los precios incluyen IVA (21%) cuando corresponda</li>
                                <li>Los precios <strong>NO incluyen</strong> el costo de envío, salvo indicación expresa</li>
                                <li>El precio final que pagás es el que figura al momento de confirmar tu compra</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">6.2. Modificación de Precios</h3>
                            <p>
                                Nos reservamos el derecho de modificar precios en cualquier momento sin previo aviso.
                                Los cambios de precio no afectarán órdenes ya confirmadas.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">6.3. Errores de Precio</h3>
                            <p>
                                En caso de detectarse un error evidente en el precio de un producto (error tipográfico,
                                error del sistema, etc.), nos reservamos el derecho de:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Cancelar la orden y notificarte</li>
                                <li>Ofrecerte la opción de reconfirmar la compra al precio correcto</li>
                                <li>Proceder con el reembolso total si ya se realizó el pago</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">6.4. Facturación</h3>
                            <p>
                                Conforme a la normativa de la AFIP, emitiremos la factura o comprobante correspondiente
                                por cada compra realizada. La factura se enviará al email registrado en tu cuenta.
                            </p>
                            <p>
                                Si necesitás factura "A" o tenés algún requerimiento especial de facturación,
                                contactanos antes de realizar la compra a {CONTACT_INFO.email}
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">6.5. Promociones y Descuentos</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Las promociones son válidas mientras estén vigentes</li>
                                <li>No son acumulables salvo indicación expresa</li>
                                <li>Nos reservamos el derecho de modificar o cancelar promociones en cualquier momento</li>
                                <li>Los cupones de descuento tienen condiciones específicas que se informan al momento de su emisión</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            7. Proceso de Compra y Contrato
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">7.1. Pedido y Oferta</h3>
                            <p>
                                Al realizar un pedido, estás haciendo una oferta de compra sujeta a estos T&C.
                                El contrato de compraventa se perfecciona cuando:
                            </p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Agregás productos al carrito</li>
                                <li>Completás tus datos de envío</li>
                                <li>Seleccionás el método de pago</li>
                                <li>Confirmás el pedido</li>
                                <li>Recibís el email de confirmación de orden</li>
                            </ol>

                            <h3 className="text-xl font-semibold text-text-primary">7.2. Confirmación de Pedido</h3>
                            <p>
                                Una vez realizado el pedido, recibirás un email de confirmación con:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Número de orden</li>
                                <li>Detalle de productos</li>
                                <li>Precios y total</li>
                                <li>Datos de envío</li>
                                <li>Método de pago seleccionado</li>
                            </ul>
                            <p>
                                <strong>Importante:</strong> El email de confirmación NO implica la aceptación
                                definitiva del pedido. Nos reservamos el derecho de rechazar pedidos en los casos
                                previstos en estos T&C.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">7.3. Aceptación del Pedido</h3>
                            <p>
                                La aceptación definitiva del pedido está sujeta a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Verificación de disponibilidad de stock</li>
                                <li>Validación del medio de pago</li>
                                <li>Confirmación de la dirección de envío</li>
                                <li>Cumplimiento de estos T&C</li>
                            </ul>
                            <p>
                                Te notificaremos por email cuando tu pedido sea aceptado y comience a procesarse.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">7.4. Derecho de Rechazo o Cancelación</h3>
                            <p>
                                Nos reservamos el derecho de rechazar o cancelar cualquier pedido, total o parcialmente,
                                sin necesidad de expresar causa, en los siguientes casos:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Falta de disponibilidad de productos</li>
                                <li>Errores evidentes en el precio del producto</li>
                                <li>Información de contacto o envío incorrecta o incompleta</li>
                                <li>Problemas con el medio de pago</li>
                                <li>Sospecha razonable de fraude o actividad ilícita</li>
                                <li>Incumplimiento de estos T&C</li>
                                <li>Caso fortuito o fuerza mayor</li>
                            </ul>
                            <p>
                                En caso de cancelación después de haberse efectuado el pago, procederemos al
                                reembolso total dentro de los 10 días hábiles.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            8. Medios de Pago
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>Aceptamos los siguientes medios de pago en Argentina:</p>

                            <div className="space-y-4">
                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        💳 Mercado Pago
                                    </h4>
                                    <ul className="list-disc pl-6 text-sm space-y-1">
                                        <li>Tarjetas de crédito (Visa, Mastercard, American Express)</li>
                                        <li>Tarjetas de débito</li>
                                        <li>Efectivo (RapiPago, Pago Fácil)</li>
                                        <li>Saldo en cuenta de Mercado Pago</li>
                                        <li>Cuotas según promociones bancarias vigentes</li>
                                    </ul>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        📱 Modo
                                    </h4>
                                    <p className="text-sm">
                                        Transferencia inmediata a través de CVU. Pago instantáneo y seguro.
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        🏦 Transferencia Bancaria
                                    </h4>
                                    <p className="text-sm mb-2">
                                        <strong className="text-success">10% de descuento adicional</strong>
                                    </p>
                                    <ul className="list-disc pl-6 text-sm space-y-1">
                                        <li>Recibirás los datos bancarios por email</li>
                                        <li>Plazo máximo para acreditar: 48 horas hábiles</li>
                                        <li>Debés enviar el comprobante a {CONTACT_INFO.email}</li>
                                    </ul>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">8.1. Seguridad de Pagos</h3>
                            <p>
                                Los pagos se procesan a través de plataformas seguras de terceros (Mercado Pago, Modo).
                                No almacenamos información de tarjetas de crédito en nuestros servidores.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">8.2. Validación de Pagos</h3>
                            <p>
                                Nos reservamos el derecho de validar la identidad del comprador y los datos de pago
                                antes de procesar el pedido. Podemos solicitar documentación adicional si lo consideramos
                                necesario para prevenir fraudes.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Truck className="w-6 h-6" />
                            9. Envíos y Entregas
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">9.1. Alcance Geográfico</h3>
                            <p>
                                Realizamos envíos a todo el territorio de la <strong>República Argentina</strong> a
                                través de empresas de correo habilitadas (Correo Argentino, Andreani, OCA, u otros).
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">9.2. Costos de Envío</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    El costo de envío varía según la provincia de destino, peso y volumen del paquete
                                </li>
                                <li>
                                    El costo se calculará y se informará antes de finalizar la compra
                                </li>
                                <li>
                                    <strong>Envíos GRATIS</strong> en compras superiores a <strong>$50.000</strong>
                                    {' '}(puede variar según promociones vigentes)
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">9.3. Plazos de Entrega</h3>
                            <p>
                                Los plazos de entrega son <strong>estimativos</strong> y comienzan a contar desde
                                la confirmación del pago:
                            </p>
                            <div className="bg-white border border-border rounded-lg p-4 space-y-2">
                                <p><strong>Capital Federal y Gran Buenos Aires:</strong> 2 a 4 días hábiles</p>
                                <p><strong>Interior del país:</strong> 3 a 7 días hábiles</p>
                                <p className="text-sm text-text-muted mt-2">
                                    * Zonas remotas o de difícil acceso pueden tener plazos mayores
                                </p>
                            </div>
                            <p>
                                Los plazos de entrega son <strong>aproximados</strong> y pueden verse afectados por:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Demoras del correo o empresa de transporte</li>
                                <li>Condiciones climáticas adversas</li>
                                <li>Feriados nacionales o locales</li>
                                <li>Paros o huelgas</li>
                                <li>Casos de fuerza mayor</li>
                            </ul>
                            <p>
                                <strong>No nos hacemos responsables por demoras causadas por terceros</strong> (correos,
                                aduanas, etc.) o circunstancias de fuerza mayor.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">9.4. Seguimiento del Envío</h3>
                            <p>
                                Una vez despachado tu pedido, recibirás:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Email con número de tracking</li>
                                <li>Link para seguir el envío en tiempo real</li>
                                <li>Nombre de la empresa de correo</li>
                            </ul>
                            <p>
                                También podés ver el estado de tu pedido en la sección "Mis Órdenes" de tu cuenta.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">9.5. Recepción del Producto</h3>
                            <p>
                                Al recibir el paquete, <strong>es importante</strong> que:
                            </p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>
                                    Verifiques que el paquete esté en buen estado externo (no golpeado, mojado o abierto)
                                </li>
                                <li>
                                    Si el paquete presenta daños evidentes, <strong>NO lo recibas</strong> y hacé el
                                    reclamo al correo inmediatamente
                                </li>
                                <li>
                                    Una vez recibido, verificá que el contenido coincida con tu pedido
                                </li>
                                <li>
                                    Si hay algún problema, contactanos dentro de las 48 horas
                                </li>
                            </ol>

                            <h3 className="text-xl font-semibold text-text-primary">9.6. Imposibilidad de Entrega</h3>
                            <p>
                                Si el correo no puede realizar la entrega por ausencia del destinatario:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Dejará un aviso de visita</li>
                                <li>El paquete quedará disponible en la sucursal del correo</li>
                                <li>Tendrás un plazo de 10 días para retirarlo</li>
                                <li>Pasado ese plazo, el paquete retornará a nuestro depósito y se te cobrará el nuevo envío</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">9.7. Responsabilidad por Datos Incorrectos</h3>
                            <p>
                                No nos hacemos responsables por demoras o imposibilidad de entrega causadas por:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Dirección incorrecta o incompleta</li>
                                <li>Número de teléfono incorrecto o sin respuesta</li>
                                <li>Ausencia reiterada del destinatario</li>
                                <li>Negativa a recibir el paquete sin causa justificada</li>
                            </ul>
                            <p>
                                En estos casos, los costos adicionales de reenvío serán a cargo del comprador.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                            <RefreshCw className="w-6 h-6" />
                            10. Derecho de Arrepentimiento (Art. 34 Ley 24.240)
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                                <p className="font-semibold text-text-primary mb-2">
                                    📜 Marco Legal
                                </p>
                                <p className="text-sm">
                                    De acuerdo con el artículo 34 de la Ley 24.240 de Defensa del Consumidor,
                                    en las ventas realizadas fuera del establecimiento comercial (como las ventas
                                    online), el consumidor tiene derecho a revocar la aceptación de la compra dentro
                                    de los <strong>10 días corridos</strong> contados a partir de la entrega del producto,
                                    sin responsabilidad alguna y sin necesidad de expresar causa.
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">10.1. Plazo</h3>
                            <p>
                                Tenés <strong>10 días corridos</strong> desde la recepción del producto para ejercer
                                tu derecho de arrepentimiento.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">10.2. Condiciones</h3>
                            <p>
                                Para ejercer este derecho, el producto debe:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Estar <strong>sin usar</strong> y en perfectas condiciones</li>
                                <li>Conservar su <strong>embalaje original</strong></li>
                                <li>Mantener todas sus <strong>etiquetas</strong> intactas</li>
                                <li>No presentar señales de uso, desgaste, manchas o daños</li>
                                <li>Incluir todos los <strong>accesorios</strong> y documentación original</li>
                            </ul>

                            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                                <p className="text-sm font-semibold text-text-primary mb-2">
                                    ⚠️ Importante - Excepciones
                                </p>
                                <p className="text-sm">
                                    Por razones de higiene y salud, <strong>NO se aceptan devoluciones</strong> de:
                                </p>
                                <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                                    <li>Ropa interior</li>
                                    <li>Medias y calcetines</li>
                                    <li>Trajes de baño</li>
                                    <li>Productos que hayan tenido contacto directo con el cuerpo sin protección</li>
                                </ul>
                                <p className="text-sm mt-2">
                                    Esto solo aplica si las etiquetas fueron removidas o el producto fue usado.
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">10.3. Procedimiento</h3>
                            <p>
                                Para ejercer tu derecho de arrepentimiento:
                            </p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>
                                    Enviá un email a <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline">{CONTACT_INFO.email}</a> indicando:
                                    <ul className="list-disc pl-6 mt-2 space-y-1">
                                        <li>Número de orden</li>
                                        <li>Productos que deseás devolver</li>
                                        <li>Motivo (opcional)</li>
                                    </ul>
                                </li>
                                <li>
                                    Te enviaremos instrucciones para la devolución dentro de las 48 horas
                                </li>
                                <li>
                                    Debés enviar el producto dentro de los 10 días corridos desde la recepción
                                </li>
                                <li>
                                    Una vez que recibamos y verifiquemos el producto, procesaremos el reembolso
                                </li>
                            </ol>

                            <h3 className="text-xl font-semibold text-text-primary">10.4. Costos de Devolución</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Si el producto tiene defectos:</strong> Nosotros nos hacemos cargo
                                    del costo de envío
                                </li>
                                <li>
                                    <strong>Si te arrepentiste de la compra:</strong> El costo del envío de
                                    devolución corre por tu cuenta
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">10.5. Reintegro del Importe</h3>
                            <p>
                                El reintegro del importe se realizará:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Dentro de los <strong>5 días hábiles</strong> posteriores a la recepción
                                    del producto devuelto
                                </li>
                                <li>
                                    Por el <strong>mismo medio de pago</strong> utilizado en la compra
                                </li>
                                <li>
                                    El monto incluye el precio del producto (NO el costo de envío original,
                                    salvo que el producto tenga defectos)
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            11. Política de Cambios y Devoluciones
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Además del derecho de arrepentimiento legal, ofrecemos una política de cambios
                                más extensa:
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">11.1. Cambios por Talle o Color</h3>
                            <p>
                                Aceptamos cambios por talle o color dentro de los <strong>30 días corridos</strong>
                                {' '}desde la recepción del producto, siempre que se cumplan las condiciones del punto 10.2.
                            </p>
                            <p>
                                <strong>Proceso:</strong>
                            </p>
                            <ol className="list-decimal pl-6 space-y-2">
                                <li>Contactanos a {CONTACT_INFO.email}</li>
                                <li>Verificaremos disponibilidad del talle/color solicitado</li>
                                <li>Te enviaremos instrucciones de devolución</li>
                                <li>Una vez recibido el producto, te enviamos el cambio</li>
                            </ol>
                            <p className="text-sm text-text-muted">
                                * El costo de envío del producto a cambiar corre por cuenta del cliente.
                                El envío del nuevo producto corre por nuestra cuenta.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">11.2. Productos con Defectos de Fábrica</h3>
                            <p>
                                Si el producto presenta defectos de fabricación, tenés derecho a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Cambio</strong> por un producto igual en perfecto estado
                                </li>
                                <li>
                                    <strong>Devolución</strong> del dinero
                                </li>
                                <li>
                                    <strong>Descuento</strong> sobre el precio (si aceptás quedarte con el producto defectuoso)
                                </li>
                            </ul>
                            <p>
                                En estos casos, <strong>todos los costos de envío corren por nuestra cuenta</strong>.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">11.3. Producto Incorrecto</h3>
                            <p>
                                Si recibiste un producto diferente al que pediste:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Contactanos inmediatamente</li>
                                <li>Te enviaremos el producto correcto sin cargo</li>
                                <li>Coordinaremos el retiro del producto incorrecto</li>
                                <li>Todos los costos corren por nuestra cuenta</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">11.4. Garantía</h3>
                            <p>
                                Todos nuestros productos cuentan con <strong>90 días de garantía</strong> contra
                                defectos de fabricación, conforme a la Ley 24.240 de Defensa del Consumidor.
                            </p>
                            <p>
                                La garantía NO cubre:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Desgaste natural por uso normal</li>
                                <li>Daños causados por mal uso o negligencia</li>
                                <li>Modificaciones realizadas por el comprador</li>
                                <li>Daños causados por lavado incorrecto</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            12. Uso del Sitio Web
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">12.1. Usos Permitidos</h3>
                            <p>El Sitio está destinado exclusivamente para:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Navegación y consulta de productos</li>
                                <li>Realización de compras para uso personal</li>
                                <li>Gestión de cuenta de usuario</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">12.2. Usos Prohibidos</h3>
                            <p>Queda expresamente prohibido:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Utilizar el Sitio para fines ilegales o fraudulentos</li>
                                <li>Intentar vulnerar la seguridad del Sitio</li>
                                <li>Realizar ingeniería inversa, descompilar o desensamblar el Sitio</li>
                                <li>Utilizar robots, scrapers o herramientas automáticas sin autorización</li>
                                <li>Copiar, reproducir o distribuir el contenido del Sitio sin autorización</li>
                                <li>Realizar compras para reventa comercial sin ser distribuidor autorizado</li>
                                <li>Hacerse pasar por otra persona o entidad</li>
                                <li>Interferir con el normal funcionamiento del Sitio</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">12.3. Consecuencias del Mal Uso</h3>
                            <p>
                                El incumplimiento de estas disposiciones puede resultar en:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Suspensión o cancelación de tu cuenta</li>
                                <li>Cancelación de pedidos pendientes</li>
                                <li>Prohibición de realizar compras futuras</li>
                                <li>Acciones legales si corresponde</li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            13. Propiedad Intelectual
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Todo el contenido del Sitio, incluyendo pero no limitado a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Textos, gráficos, logos, iconos</li>
                                <li>Imágenes y fotografías</li>
                                <li>Videos y audios</li>
                                <li>Código fuente y software</li>
                                <li>Diseño y estructura del Sitio</li>
                                <li>Nombres, marcas y signos distintivos</li>
                            </ul>
                            <p>
                                Es propiedad de {COMPANY_INFO.name} o de sus licenciantes y está protegido por
                                las leyes de propiedad intelectual de Argentina (Ley 11.723 de Propiedad Intelectual,
                                Ley 22.362 de Marcas y Designaciones y normativa concordante).
                            </p>
                            <p>
                                <strong>Queda estrictamente prohibido:</strong>
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Reproducir, copiar, distribuir o modificar cualquier contenido sin autorización</li>
                                <li>Usar contenido para fines comerciales sin licencia</li>
                                <li>Extraer bases de datos o listados de productos</li>
                                <li>Utilizar marcas, logos o nombres comerciales de {COMPANY_INFO.name}</li>
                            </ul>
                            <p>
                                El uso del Sitio no te otorga ningún derecho de propiedad sobre el contenido.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            14. Limitación de Responsabilidad
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Sin perjuicio de las garantías establecidas por la Ley 24.240 de Defensa del Consumidor,
                                {COMPANY_INFO.name} no se hace responsable por:
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">14.1. Uso del Sitio</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Interrupciones, errores o fallas en el funcionamiento del Sitio</li>
                                <li>Virus informáticos o código malicioso</li>
                                <li>Pérdida de datos o información</li>
                                <li>Daños causados por el uso indebido del Sitio</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">14.2. Servicios de Terceros</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Demoras o problemas en servicios de correo o transporte</li>
                                <li>Fallas en plataformas de pago de terceros</li>
                                <li>Contenido de sitios web enlazados</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">14.3. Caso Fortuito o Fuerza Mayor</h3>
                            <p>
                                No seremos responsables por incumplimientos causados por circunstancias de fuerza
                                mayor o caso fortuito, incluyendo pero no limitado a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Desastres naturales</li>
                                <li>Guerras, disturbios, actos de terrorismo</li>
                                <li>Huelgas o paros</li>
                                <li>Cortes de energía o comunicaciones</li>
                                <li>Actos de gobierno o autoridades</li>
                                <li>Pandemias o emergencias sanitarias</li>
                            </ul>

                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                <p className="text-sm">
                                    <strong>Importante:</strong> Esta limitación no afecta los derechos que te
                                    corresponden como consumidor según la Ley 24.240 de Defensa del Consumidor.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            15. Protección de Datos Personales
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                El tratamiento de tus datos personales se rige por nuestra{' '}
                                <Link href="/privacy" className="text-primary hover:underline font-semibold">
                                    Política de Privacidad
                                </Link>, elaborada conforme a la Ley 25.326 de Protección de Datos Personales
                                y su Decreto Reglamentario 1558/2001.
                            </p>
                            <p>
                                Al utilizar el Sitio y realizar compras, aceptás que tus datos personales sean
                                tratados conforme a dicha Política de Privacidad.
                            </p>
                            <p>
                                Tus datos están protegidos y solo serán utilizados para los fines relacionados
                                con la compraventa de productos y la gestión de tu cuenta.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            16. Modificaciones de los Términos y Condiciones
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Nos reservamos el derecho de modificar estos T&C en cualquier momento, sin
                                necesidad de previo aviso. Las modificaciones entrarán en vigencia desde su
                                publicación en el Sitio.
                            </p>
                            <p>
                                Es tu responsabilidad revisar periódicamente estos T&C. El uso continuado del
                                Sitio después de la publicación de modificaciones constituye tu aceptación de
                                las mismas.
                            </p>
                            <p>
                                Los pedidos realizados antes de una modificación se regirán por los T&C vigentes
                                al momento de la confirmación del pedido.
                            </p>
                            <p>
                                La fecha de "Última actualización" al inicio de este documento indica cuándo
                                fue modificado por última vez.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            17. Ley Aplicable y Jurisdicción
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">17.1. Ley Aplicable</h3>
                            <p>
                                Estos Términos y Condiciones se rigen e interpretan de acuerdo con las leyes
                                de la <strong>República Argentina</strong>.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">17.2. Jurisdicción</h3>
                            <p>
                                Para cualquier controversia o reclamo derivado de estos T&C, del uso del Sitio
                                o de la compraventa de productos, las partes se someten a la jurisdicción de
                                los <strong>Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires</strong>,
                                renunciando expresamente a cualquier otro fuero o jurisdicción que pudiera corresponder.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">17.3. Defensa del Consumidor</h3>
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                                <p className="mb-4">
                                    De conformidad con lo establecido en el artículo 1122 del Código Civil y
                                    Comercial de la Nación, las relaciones de consumo se encuentran regidas por
                                    la <strong>Ley 24.240 de Defensa del Consumidor</strong>.
                                </p>
                                <p className="font-semibold mb-2">
                                    Como consumidor, tenés derecho a presentar reclamos ante:
                                </p>
                                <div className="bg-white border border-border rounded-lg p-4 space-y-3">
                                    <div>
                                        <p className="font-semibold text-text-primary">
                                            Dirección General de Defensa y Protección del Consumidor
                                        </p>
                                        <p className="text-sm">Ciudad Autónoma de Buenos Aires</p>
                                        <p className="text-sm">Tel: 0800-666-1518</p>
                                        <p className="text-sm">
                                            Web:{' '}
                                            <a
                                                href="https://www.buenosaires.gob.ar/defensaconsumidor"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                www.buenosaires.gob.ar/defensaconsumidor
                                            </a>
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t border-border">
                                        <p className="font-semibold text-text-primary">
                                            O ante el organismo de Defensa del Consumidor de tu provincia
                                        </p>
                                        <p className="text-sm mt-2">
                                            También podés iniciar reclamos a través del sistema de{' '}
                                            <a
                                                href="https://www.argentina.gob.ar/produccion/defensadelconsumidor/formulario"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                Ventanilla Única Federal de Defensa del Consumidor
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">17.4. Instancia de Mediación</h3>
                            <p>
                                Antes de iniciar acciones judiciales, las partes se comprometen a intentar
                                resolver cualquier controversia mediante negociación directa y de buena fe.
                            </p>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            18. Contacto y Consultas
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Para consultas, reclamos o ejercicio de derechos relacionados con estos T&C,
                                podés contactarnos a través de:
                            </p>
                            <div className="bg-white border border-border rounded-lg p-6">
                                <ul className="space-y-3">
                                    <li><strong>Email:</strong> {CONTACT_INFO.email}</li>
                                    <li><strong>Teléfono:</strong> {CONTACT_INFO.phone}</li>
                                    <li><strong>Dirección:</strong> {CONTACT_INFO.address}</li>
                                    <li>
                                        <strong>Horario de atención:</strong><br />
                                        Lunes a Viernes: 9:00 a 18:00 hs<br />
                                        Sábados: 9:00 a 13:00 hs
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-12">
                        <h3 className="font-bold text-text-primary mb-3">
                            📜 Marco Legal de la República Argentina
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                            Estos Términos y Condiciones se rigen por la siguiente normativa vigente:
                        </p>
                        <ul className="text-sm text-text-secondary space-y-2">
                            <li>• Ley 24.240 de Defensa del Consumidor y modificatorias</li>
                            <li>• Código Civil y Comercial de la Nación (Ley 26.994)</li>
                            <li>• Ley 25.326 de Protección de Datos Personales</li>
                            <li>• Ley 11.723 de Propiedad Intelectual</li>
                            <li>• Ley 27.078 de Tecnologías de la Información y las Comunicaciones</li>
                            <li>• Decreto 1558/2001 (Reglamentario Ley 25.326)</li>
                            <li>• Resoluciones de la Secretaría de Comercio Interior</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-text-secondary mb-6">
                        ¿Tenés alguna duda sobre nuestros términos?
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Contactanos
                    </Link>
                </div>
            </div>
        </div>
    );
}