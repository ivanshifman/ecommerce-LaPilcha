// app/privacy/page.tsx
import Link from 'next/link';
import { Shield, AlertCircle, Lock, Eye, FileText, Mail } from 'lucide-react';
import { COMPANY_INFO, CONTACT_INFO } from '../../../lib/constants/contact';

export const metadata = {
    title: 'Política de Privacidad | El Paisano',
    description: 'Política de privacidad y protección de datos personales de El Paisano',
};

export default function PrivacyPage() {
    const lastUpdate = "Enero 2026";

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="bg-campo-gradient border-b border-border">
                <div className="max-w-4xl mx-auto px-4 py-16 md:py-20">
                    <div className="flex items-center justify-center mb-6">
                        <Shield className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 text-center">
                        Política de Privacidad
                    </h1>
                    <p className="text-center text-text-secondary">
                        Última actualización: {lastUpdate}
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Aviso importante */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-12">
                    <div className="flex gap-3">
                        <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                        <div className="text-sm text-text-primary">
                            <p className="font-semibold mb-2">Tu Privacidad es Importante</p>
                            <p>
                                En {COMPANY_INFO.name} respetamos tu privacidad y nos comprometemos a proteger
                                tus datos personales conforme a la Ley 25.326 de Protección de Datos Personales
                                de la República Argentina. Esta política describe cómo recopilamos, usamos y
                                protegemos tu información.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none">
                    {/* 1. Responsable del Tratamiento */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            1. Responsable del Tratamiento de Datos
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                El responsable del tratamiento de tus datos personales es:
                            </p>
                            <div className="bg-white border border-border rounded-lg p-6">
                                <ul className="space-y-2 list-none">
                                    <li><strong>Razón Social:</strong> {COMPANY_INFO.legalName}</li>
                                    <li><strong>CUIT:</strong> {COMPANY_INFO.taxId}</li>
                                    <li><strong>Domicilio:</strong> {CONTACT_INFO.address}</li>
                                    <li><strong>Email:</strong> {CONTACT_INFO.email}</li>
                                    <li><strong>Teléfono:</strong> {CONTACT_INFO.phone}</li>
                                </ul>
                            </div>
                            <p>
                                Nuestros archivos de datos personales se encuentran debidamente inscriptos ante
                                la Agencia de Acceso a la Información Pública, en cumplimiento de la Ley 25.326
                                y su Decreto Reglamentario 1558/2001.
                            </p>
                        </div>
                    </section>

                    {/* 2. Alcance */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            2. Alcance de esta Política
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Esta Política de Privacidad se aplica a:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>El sitio web <strong>elpaisano.com.ar</strong></li>
                                <li>Aplicaciones móviles de {COMPANY_INFO.name} (si las hubiere)</li>
                                <li>Cualquier interacción que tengas con nosotros relacionada con la compra de productos</li>
                                <li>Comunicaciones por email, teléfono o redes sociales</li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. Datos que Recopilamos */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            3. Información que Recopilamos
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <h3 className="text-xl font-semibold text-text-primary">3.1. Datos que nos proporcionás directamente</h3>

                            <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                                <div>
                                    <h4 className="font-semibold text-text-primary mb-2">Al crear una cuenta:</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Nombre y apellido</li>
                                        <li>Dirección de email</li>
                                        <li>Contraseña (encriptada)</li>
                                        <li>Número de teléfono (opcional)</li>
                                        <li>Foto de perfil (opcional)</li>
                                        <li>Preferencias de talle y color (opcional)</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-text-primary mb-2">Al realizar una compra:</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Dirección de envío</li>
                                        <li>Información de facturación</li>
                                        <li>Método de pago elegido</li>
                                        <li>Historial de compras</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-text-primary mb-2">Al contactarnos:</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Consultas y mensajes</li>
                                        <li>Reclamos o solicitudes de devolución</li>
                                        <li>Feedback sobre productos</li>
                                    </ul>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">3.2. Datos que recopilamos automáticamente</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Información de navegación:</strong> Dirección IP, tipo de navegador,
                                    dispositivo, sistema operativo, páginas visitadas, tiempo de permanencia
                                </li>
                                <li>
                                    <strong>Cookies y tecnologías similares:</strong> Para mejorar tu experiencia
                                    y recordar tus preferencias (ver sección 8)
                                </li>
                                <li>
                                    <strong>Datos de uso:</strong> Productos que visualizás, agregás al carrito
                                    o añadís a favoritos
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold text-text-primary">3.3. Datos de terceros</h3>
                            <p>
                                Si iniciás sesión a través de servicios de terceros (Google, Facebook),
                                recibiremos la información que autorizaste compartir según la configuración
                                de privacidad de dichas plataformas.
                            </p>
                        </div>
                    </section>

                    {/* 4. Finalidad del Tratamiento */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            4. Para Qué Usamos tu Información
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Utilizamos tus datos personales para las siguientes finalidades, todas ellas
                                relacionadas con la relación comercial entre vos y {COMPANY_INFO.name}:
                            </p>

                            <div className="space-y-4">
                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        📦 Gestión de compras y pedidos
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Procesar tus órdenes y pagos</li>
                                        <li>Gestionar envíos y entregas</li>
                                        <li>Emitir facturas y comprobantes</li>
                                        <li>Gestionar cambios y devoluciones</li>
                                        <li>Prevenir fraudes</li>
                                    </ul>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        👤 Gestión de cuenta de usuario
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Crear y mantener tu cuenta</li>
                                        <li>Personalizar tu experiencia según tus preferencias</li>
                                        <li>Permitirte guardar productos favoritos</li>
                                        <li>Gestionar tu historial de compras</li>
                                    </ul>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        📧 Comunicaciones
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Enviar confirmaciones de pedido</li>
                                        <li>Notificaciones sobre el estado de envío</li>
                                        <li>Responder consultas y brindar soporte</li>
                                        <li>Enviar información sobre cambios en nuestros servicios</li>
                                        <li>
                                            Enviar ofertas y novedades (solo si diste tu consentimiento expreso
                                            y podés darte de baja en cualquier momento)
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        📊 Análisis y mejora del servicio
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Analizar el comportamiento de navegación (de forma agregada y anónima)</li>
                                        <li>Mejorar nuestros productos y servicios</li>
                                        <li>Desarrollar nuevas funcionalidades</li>
                                        <li>Realizar estudios de mercado</li>
                                    </ul>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        ⚖️ Cumplimiento legal
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-1 text-sm">
                                        <li>Cumplir con obligaciones fiscales y contables</li>
                                        <li>Atender requerimientos de autoridades competentes</li>
                                        <li>Ejercer o defender derechos en procedimientos legales</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 5. Base Legal */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            5. Base Legal del Tratamiento
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Tratamos tus datos personales sobre la base de:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Ejecución del contrato:</strong> El tratamiento es necesario para
                                    cumplir con la compra que realizaste
                                </li>
                                <li>
                                    <strong>Consentimiento:</strong> Has aceptado expresamente que tratemos tus
                                    datos para fines específicos (como recibir novedades)
                                </li>
                                <li>
                                    <strong>Interés legítimo:</strong> Para mejorar nuestros servicios, prevenir
                                    fraudes y garantizar la seguridad
                                </li>
                                <li>
                                    <strong>Cumplimiento legal:</strong> Cuando debamos cumplir con obligaciones
                                    legales (fiscales, contables, etc.)
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 6. Compartir Información */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            6. Con Quién Compartimos tu Información
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                No vendemos ni alquilamos tus datos personales a terceros. Solo compartimos
                                información estrictamente necesaria con:
                            </p>

                            <div className="space-y-4">
                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        🚚 Proveedores de servicios logísticos
                                    </h4>
                                    <p className="text-sm">
                                        Correos y empresas de transporte para gestionar envíos (Correo Argentino,
                                        Andreani, OCA, etc.). Solo compartimos nombre, dirección y teléfono necesarios
                                        para la entrega.
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        💳 Procesadores de pago
                                    </h4>
                                    <p className="text-sm">
                                        Mercado Pago, Modo y entidades bancarias para procesar pagos de forma segura.
                                        Estos proveedores cuentan con certificaciones de seguridad (PCI-DSS).
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        🔧 Proveedores de servicios técnicos
                                    </h4>
                                    <p className="text-sm">
                                        Servicios de hosting, almacenamiento en la nube, análisis de datos y
                                        seguridad informática que nos ayudan a operar el sitio web.
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        📧 Servicios de email
                                    </h4>
                                    <p className="text-sm">
                                        Plataformas de envío de correos electrónicos para comunicarnos contigo
                                        (confirmaciones de pedido, newsletters si te suscribiste, etc.).
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        ⚖️ Autoridades y organismos de control
                                    </h4>
                                    <p className="text-sm">
                                        Cuando sea requerido por ley o por orden judicial (AFIP, Agencia de Acceso
                                        a la Información Pública, autoridades judiciales, etc.).
                                    </p>
                                </div>
                            </div>

                            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                                <p className="text-sm font-semibold text-text-primary">
                                    ⚠️ Importante: Todos nuestros proveedores están obligados contractualmente a
                                    proteger tus datos y solo pueden utilizarlos para los fines específicos que
                                    les encomendamos.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 7. Transferencias Internacionales */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            7. Transferencias Internacionales de Datos
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Algunos de nuestros proveedores de servicios técnicos pueden estar ubicados fuera
                                de Argentina (por ejemplo, servicios de cloud computing). En estos casos:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    Solo trabajamos con proveedores que garantizan un nivel adecuado de protección
                                    de datos personales
                                </li>
                                <li>
                                    Implementamos salvaguardas contractuales que garantizan la protección de tu
                                    información conforme a los estándares argentinos
                                </li>
                                <li>
                                    Podés solicitar información específica sobre las transferencias escribiendo a{' '}
                                    {CONTACT_INFO.email}
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* 8. Cookies */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            8. Cookies y Tecnologías Similares
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">¿Qué son las cookies?</h3>
                            <p>
                                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando
                                visitás un sitio web. Nos permiten reconocerte y recordar tus preferencias.
                            </p>

                            <h3 className="text-xl font-semibold text-text-primary">Tipos de cookies que utilizamos:</h3>
                            <div className="space-y-3">
                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-1">
                                        Cookies esenciales (obligatorias)
                                    </h4>
                                    <p className="text-sm">
                                        Necesarias para que el sitio funcione correctamente (carrito de compras,
                                        sesión de usuario, seguridad).
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-1">
                                        Cookies de funcionalidad
                                    </h4>
                                    <p className="text-sm">
                                        Recuerdan tus preferencias (idioma, productos favoritos, filtros aplicados).
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-1">
                                        Cookies analíticas
                                    </h4>
                                    <p className="text-sm">
                                        Nos ayudan a entender cómo usás el sitio para mejorarlo (páginas visitadas,
                                        tiempo de permanencia, errores encontrados).
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-1">
                                        Cookies de marketing (requieren consentimiento)
                                    </h4>
                                    <p className="text-sm">
                                        Permiten mostrarte publicidad relevante basada en tus intereses.
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">¿Cómo gestionarlas?</h3>
                            <p>
                                Podés configurar tu navegador para rechazar cookies o para que te notifique cuando
                                se envíe una. Sin embargo, algunas funcionalidades del sitio pueden no funcionar
                                correctamente sin cookies esenciales.
                            </p>
                        </div>
                    </section>

                    {/* 9. Seguridad */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Lock className="w-6 h-6" />
                            9. Seguridad de tus Datos
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                La seguridad de tu información es nuestra prioridad. Implementamos múltiples
                                medidas de seguridad técnicas y organizativas:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-2">
                                        🔐 Encriptación
                                    </h4>
                                    <p className="text-sm">
                                        Conexiones HTTPS/SSL para proteger datos en tránsito. Contraseñas encriptadas
                                        con algoritmos seguros.
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-2">
                                        🔒 Control de acceso
                                    </h4>
                                    <p className="text-sm">
                                        Solo personal autorizado tiene acceso a datos personales, bajo estrictas
                                        políticas de confidencialidad.
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-2">
                                        🛡️ Firewalls y antivirus
                                    </h4>
                                    <p className="text-sm">
                                        Sistemas de protección contra accesos no autorizados y malware.
                                    </p>
                                </div>

                                <div className="bg-white border border-border rounded-lg p-4">
                                    <h4 className="font-semibold text-text-primary text-sm mb-2">
                                        📋 Auditorías
                                    </h4>
                                    <p className="text-sm">
                                        Revisiones periódicas de seguridad y actualización de protocolos.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                                <p className="text-sm">
                                    <strong>Importante:</strong> Ningún sistema es 100% seguro. Si detectás alguna
                                    actividad sospechosa en tu cuenta, contactanos inmediatamente a{' '}
                                    {CONTACT_INFO.email}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 10. Conservación */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            10. ¿Cuánto Tiempo Conservamos tus Datos?
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Conservamos tus datos personales solo durante el tiempo necesario para cumplir
                                con las finalidades descritas:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Datos de cuenta:</strong> Mientras tu cuenta esté activa, o según lo
                                    requiera la ley
                                </li>
                                <li>
                                    <strong>Datos de compras:</strong> 10 años (plazo legal de conservación de
                                    documentación contable en Argentina)
                                </li>
                                <li>
                                    <strong>Datos de marketing:</strong> Hasta que retirés tu consentimiento
                                </li>
                                <li>
                                    <strong>Datos de navegación:</strong> Generalmente entre 6 meses y 2 años,
                                    según el tipo de cookie
                                </li>
                            </ul>
                            <p>
                                Una vez vencidos estos plazos, eliminaremos o anonimizaremos tus datos de forma
                                segura, salvo que estemos obligados legalmente a conservarlos por más tiempo.
                            </p>
                        </div>
                    </section>

                    {/* 11. Derechos del Titular */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                            <Eye className="w-6 h-6" />
                            11. Tus Derechos como Titular de Datos
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Conforme a la Ley 25.326, tenés derecho a:
                            </p>

                            <div className="space-y-3">
                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        📋 Acceso
                                    </h4>
                                    <p className="text-sm">
                                        Solicitar información sobre qué datos personales tuyos tenemos, cómo los
                                        usamos y con quién los compartimos.
                                    </p>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        ✏️ Rectificación
                                    </h4>
                                    <p className="text-sm">
                                        Corregir datos inexactos o desactualizados. Podés hacerlo directamente desde
                                        tu perfil o contactándonos.
                                    </p>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        🗑️ Supresión
                                    </h4>
                                    <p className="text-sm">
                                        Solicitar la eliminación de tus datos cuando ya no sean necesarios o hayas
                                        retirado tu consentimiento (sujeto a obligaciones legales de conservación).
                                    </p>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        🔒 Bloqueo/Oposición
                                    </h4>
                                    <p className="text-sm">
                                        Oponerte al tratamiento de tus datos para determinadas finalidades
                                        (por ejemplo, marketing directo).
                                    </p>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        📥 Portabilidad
                                    </h4>
                                    <p className="text-sm">
                                        Recibir tus datos en un formato estructurado y de uso común.
                                    </p>
                                </div>

                                <div className="bg-white border-l-4 border-primary p-4">
                                    <h4 className="font-semibold text-text-primary mb-2">
                                        ✋ Revocación del consentimiento
                                    </h4>
                                    <p className="text-sm">
                                        Retirar tu consentimiento en cualquier momento para tratamientos que lo requieran
                                        (como newsletters).
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">¿Cómo ejercer tus derechos?</h3>
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                                <p className="mb-4">
                                    Podés ejercer estos derechos enviando un email a:
                                </p>
                                <div className="flex items-center gap-3 mb-4">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <a
                                        href={`mailto:${CONTACT_INFO.email}`}
                                        className="text-primary font-semibold hover:underline"
                                    >
                                        {CONTACT_INFO.email}
                                    </a>
                                </div>
                                <p className="text-sm">
                                    En tu solicitud, por favor incluí:
                                </p>
                                <ul className="list-disc pl-6 text-sm space-y-1 mt-2">
                                    <li>Nombre completo</li>
                                    <li>Email asociado a tu cuenta</li>
                                    <li>Descripción clara del derecho que deseás ejercer</li>
                                    <li>Copia de tu DNI (para verificar identidad)</li>
                                </ul>
                                <p className="text-sm mt-4">
                                    Responderemos a tu solicitud dentro de los <strong>10 días hábiles</strong>
                                    {' '}establecidos por ley.
                                </p>
                            </div>

                            <h3 className="text-xl font-semibold text-text-primary">Derecho de Reclamo</h3>
                            <p>
                                Si considerás que tus derechos no fueron respetados, podés presentar un reclamo ante:
                            </p>
                            <div className="bg-white border border-border rounded-lg p-6">
                                <p className="font-semibold text-text-primary mb-2">
                                    Agencia de Acceso a la Información Pública
                                </p>
                                <ul className="space-y-1 text-sm">
                                    <li>Sitio web:{' '}
                                        <a
                                            href="https://www.argentina.gob.ar/aaip"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            www.argentina.gob.ar/aaip
                                        </a>
                                    </li>
                                    <li>Teléfono: 0800-333-2247</li>
                                    <li>Email: datospersonales@aaip.gob.ar</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 12. Menores de Edad */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            12. Menores de Edad
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos
                                conscientemente información de menores de edad.
                            </p>
                            <p>
                                Si sos padre/madre o tutor y descubrís que tu hijo/a menor de 18 años nos ha
                                proporcionado datos personales sin tu consentimiento, contactanos inmediatamente
                                para que podamos eliminarlos.
                            </p>
                        </div>
                    </section>

                    {/* 13. Enlaces a Terceros */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            13. Enlaces a Sitios de Terceros
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Nuestro sitio puede contener enlaces a sitios web de terceros (redes sociales,
                                proveedores de pago, etc.). No somos responsables de las prácticas de privacidad
                                de estos sitios.
                            </p>
                            <p>
                                Te recomendamos leer las políticas de privacidad de cada sitio que visites.
                            </p>
                        </div>
                    </section>

                    {/* 14. Modificaciones */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            14. Modificaciones a esta Política
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Nos reservamos el derecho de actualizar esta Política de Privacidad periódicamente
                                para reflejar cambios en nuestras prácticas, legislación o por otras razones
                                operativas.
                            </p>
                            <p>
                                Cuando realicemos cambios significativos, te notificaremos a través de:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Un aviso destacado en nuestro sitio web</li>
                                <li>Email a la dirección registrada en tu cuenta</li>
                                <li>Notificación al iniciar sesión</li>
                            </ul>
                            <p>
                                La fecha de "Última actualización" al inicio de esta política indica cuándo fue
                                modificada por última vez.
                            </p>
                        </div>
                    </section>

                    {/* 15. Contacto */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            15. Contacto
                        </h2>
                        <div className="text-text-secondary space-y-4">
                            <p>
                                Si tenés preguntas, consultas o inquietudes sobre esta Política de Privacidad
                                o sobre cómo tratamos tus datos personales, podés contactarnos a través de:
                            </p>
                            <div className="bg-white border border-border rounded-lg p-6">
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-text-primary">Email:</p>
                                            <a
                                                href={`mailto:${CONTACT_INFO.email}`}
                                                className="text-primary hover:underline"
                                            >
                                                {CONTACT_INFO.email}
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-text-primary">Teléfono:</p>
                                            <a
                                                href={`tel:${CONTACT_INFO.phoneRaw}`}
                                                className="text-primary hover:underline"
                                            >
                                                {CONTACT_INFO.phone}
                                            </a>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-text-primary">Dirección:</p>
                                            <p>{CONTACT_INFO.address}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Reconocimiento Legal */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-12">
                        <h3 className="font-bold text-text-primary mb-3">
                            📜 Marco Legal Aplicable
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                            Esta Política de Privacidad se rige por la legislación argentina vigente, incluyendo:
                        </p>
                        <ul className="text-sm text-text-secondary space-y-2">
                            <li>• Ley 25.326 de Protección de Datos Personales</li>
                            <li>• Decreto Reglamentario 1558/2001</li>
                            <li>• Disposiciones de la Agencia de Acceso a la Información Pública</li>
                            <li>• Ley 24.240 de Defensa del Consumidor</li>
                            <li>• Código Civil y Comercial de la Nación</li>
                        </ul>
                    </div>
                </div>

                {/* CTA Final */}
                <div className="mt-12 text-center space-y-6">
                    <p className="text-text-secondary">
                        ¿Tenés dudas sobre cómo protegemos tu información?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/contact"
                            className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Contactanos
                        </Link>
                        <Link
                            href="/terms"
                            className="inline-block px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                        >
                            Ver Términos y Condiciones
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}