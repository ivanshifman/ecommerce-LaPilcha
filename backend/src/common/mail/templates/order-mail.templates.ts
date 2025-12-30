import { OrderMailDto } from '../dto/order-mail.dto';

const money = (value: number) =>
  value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:24px;">
<table width="600" style="background:#ffffff;border-radius:8px;overflow:hidden;">
  
  <tr>
    <td style="background:#111827;color:#fff;padding:20px;">
      <h1 style="margin:0;font-size:20px;">La Pilcha</h1>
    </td>
  </tr>

  <tr>
    <td style="padding:24px;">
      ${content}
    </td>
  </tr>

  <tr>
    <td style="background:#f9fafb;padding:16px;font-size:12px;color:#6b7280;">
      © ${new Date().getFullYear()} La Pilcha
    </td>
  </tr>

</table>
</td>
</tr>
</table>
</body>
</html>
`;

export class OrderMailTemplates {
  static confirmation(order: OrderMailDto) {
    const rows = order.items
      .map(
        (item) => `
<tr>
  <td style="padding:12px 0;">
    <img src="${item.image ?? ''}" width="60" style="border-radius:6px;" />
  </td>
  <td style="padding:12px;">
    <strong>${item.name}</strong><br/>
    ${item.variant?.size ? `Talle: ${item.variant.size}` : ''}
  </td>
  <td align="center">${item.quantity}</td>
  <td align="right">${money(item.unitPrice)}</td>
  <td align="right"><strong>${money(item.subtotal)}</strong></td>
</tr>
`,
      )
      .join('');

    return baseTemplate(`
<h2 style="margin-top:0;">Orden ${order.orderNumber}</h2>

<p>Gracias por tu compra. Estos son los detalles de tu pedido:</p>

<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
<tr style="border-bottom:1px solid #e5e7eb;">
  <th></th>
  <th align="left">Producto</th>
  <th>Cant.</th>
  <th align="right">Precio</th>
  <th align="right">Subtotal</th>
</tr>

${rows}
</table>

<hr style="margin:24px 0;" />

<table width="100%">
<tr><td>Subtotal</td><td align="right">${money(order.subtotal)}</td></tr>
<tr><td>Descuento</td><td align="right">-${money(order.discount)}</td></tr>
${
  order.couponApplied
    ? `<tr style="color:#16a34a;"><td>Cupón aplicado (${order.couponApplied.code})</td><td align="right">-${money(order.couponApplied.discountAmount)}</td></tr>`
    : ''
}
<tr><td>Envío</td><td align="right">${money(order.shippingCost)}</td></tr>
<tr>
  <td><strong>Total</strong></td>
  <td align="right"><strong>${money(order.total)}</strong></td>
</tr>
</table>

<h3 style="margin-top:24px;">Dirección de envío</h3>
<p>
${order.shippingAddress.fullName}<br/>
${order.shippingAddress.address}<br/>
${order.shippingAddress.city}, ${order.shippingAddress.province}<br/>
${order.shippingAddress.postalCode} – ${order.shippingAddress.country}
</p>

<p><strong>Método de pago:</strong> ${order.paymentMethod}</p>
${
  order.couponApplied
    ? `
<div style="background:#dcfce7;border-left:4px solid #16a34a;padding:12px;margin:16px 0;">
  <p style="margin:0;"><strong>✅ Cupón aplicado: ${order.couponApplied.code}</strong></p>
  <p style="margin:4px 0;">Ahorraste ${money(order.couponApplied.discountAmount)}</p>
</div>
`
    : ''
}
`);
  }

  static cancelled(orderNumber: string) {
    return baseTemplate(`
<h2>Orden cancelada</h2>

<p>
Tu orden <strong>${orderNumber}</strong> ha sido cancelada.
</p>

<p>
Si creés que esto es un error o tenés dudas, podés responder este correo
y nuestro equipo te va a ayudar.
</p>

<hr style="margin:24px 0;" />

<p style="color:#6b7280;font-size:13px;">
Lamentamos cualquier inconveniente.
</p>
`);
  }

  static shipped(orderNumber: string, trackingNumber?: string) {
    return baseTemplate(`
<h2>Tu pedido está en camino 🚚</h2>

<p>
La orden <strong>${orderNumber}</strong> fue despachada correctamente.
</p>

${trackingNumber ? `<p><strong>Número de seguimiento:</strong> ${trackingNumber}</p>` : ''}

<p>
En breve recibirás tu pedido.
</p>
`);
  }

  static delivered(orderNumber: string) {
    return baseTemplate(`
<h2>Pedido entregado 🎉</h2>

<p>
Tu orden <strong>${orderNumber}</strong> fue entregada con éxito.
</p>

<p>
Esperamos que disfrutes tu compra.
</p>

<hr style="margin:24px 0;" />

<p style="font-size:13px;color:#6b7280;">
Gracias por confiar en La Pilcha.
</p>
`);
  }

  static refunded(order: { orderNumber: string; total: number; paymentMethod: string }) {
    return baseTemplate(`
<h2>Reembolso procesado</h2>

<p>
El reembolso de tu orden <strong>${order.orderNumber}</strong> fue procesado correctamente.
</p>

<table width="100%" style="margin:16px 0;">
<tr>
  <td>Total reembolsado</td>
  <td align="right"><strong>${money(order.total)}</strong></td>
</tr>
<tr>
  <td>Método de pago</td>
  <td align="right">${order.paymentMethod}</td>
</tr>
</table>

<p style="margin-top:16px;">
El dinero será acreditado en el mismo medio de pago utilizado en la compra.
</p>

<p style="color:#6b7280;font-size:13px;">
El plazo de acreditación puede demorar entre <strong>5 y 10 días hábiles</strong>,
dependiendo del medio de pago y la entidad bancaria.
</p>

<hr style="margin:24px 0;" />

<p style="font-size:13px;color:#6b7280;">
Si tenés alguna consulta, podés responder este correo y nuestro equipo te va a ayudar.
</p>
`);
  }

  static readyForPickup(orderNumber: string) {
    return baseTemplate(`
<div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">¡Tu pedido está listo! 🎉</h2>
          <p style="font-size: 16px; color: #555;">
            Tu pedido <strong>#${orderNumber}</strong> está listo para ser retirado.
          </p>
          
          <div style="background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Información de retiro</h3>
            <p style="color: #555; line-height: 1.8;">
              <strong>Dirección:</strong><br>
              [TU DIRECCIÓN DE SUCURSAL]<br>
              Buenos Aires, Argentina<br><br>
              
              <strong>Horarios de atención:</strong><br>
              Lunes a Viernes: 10:00 - 18:00hs<br>
              Sábados: 10:00 - 14:00hs<br><br>

              <strong>¿Qué necesitás traer?</strong><br>
              - DNI del titular de la compra<br>
              - Número de pedido: <strong>${orderNumber}</strong>
            </p>
          </div>

          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Importante:</strong> Tenés 7 días para retirar tu pedido. 
              Pasado ese tiempo, la compra será cancelada automáticamente.
            </p>
          </div>

          <p style="text-align: center; color: #777; font-size: 14px; margin-top: 30px;">
            ¡Te esperamos!
          </p>
        </div>

        <div style="background-color: #000; color: #fff; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 5px 0;">&copy; 2025 La Pilcha. Todos los derechos reservados.</p>
        </div>
      </div>
`);
  }

  static returnRequested(returnNumber: string, orderNumber: string) {
    return baseTemplate(`
<h2>Solicitud de Devolución Recibida</h2>

<p>Hemos recibido tu solicitud de devolución.</p>

<table width="100%" style="margin:16px 0;">
<tr>
  <td><strong>Número de RMA:</strong></td>
  <td>${returnNumber}</td>
</tr>
<tr>
  <td><strong>Orden:</strong></td>
  <td>${orderNumber}</td>
</tr>
</table>

<div style="background:#e0f2fe;border-left:4px solid #0284c7;padding:12px;margin:16px 0;">
  <p style="margin:0;"><strong>📋 Próximos pasos:</strong></p>
  <ol style="margin:8px 0;padding-left:20px;">
    <li>Nuestro equipo revisará tu solicitud en las próximas 24-48 horas</li>
    <li>Recibirás un email con la aprobación o más instrucciones</li>
    <li>Si es aprobada, te enviaremos las instrucciones de envío</li>
  </ol>
</div>

<p style="color:#6b7280;font-size:13px;">
Si tienes dudas, responde este correo y te ayudaremos.
</p>
`);
  }

  static returnApproved(returnNumber: string, approvedAmount: number) {
    return baseTemplate(`
<h2 style="color:#16a34a;">✅ Devolución Aprobada</h2>

<p>Tu solicitud de devolución <strong>${returnNumber}</strong> ha sido aprobada.</p>

<div style="background:#dcfce7;border-left:4px solid #16a34a;padding:12px;margin:16px 0;">
  <p style="margin:0;"><strong>Monto aprobado: ${money(approvedAmount)}</strong></p>
</div>

<h3 style="margin-top:24px;">Instrucciones de envío:</h3>
<div style="background:#f9fafb;padding:16px;border-radius:6px;">
  <p><strong>Dirección de retorno:</strong><br>
  Franklin 1872 CP 1406<br>
  Buenos Aires, Argentina</p>
  
  <p style="margin-top:12px;">Por favor, incluye el número de RMA <strong>${returnNumber}</strong> en el paquete.</p>
</div>

<div style="background:#fef9c3;border-left:4px solid #eab308;padding:12px;margin:16px 0;">
  <p style="margin:0;"><strong>⚠️ Importante:</strong></p>
  <ul style="margin:8px 0;padding-left:20px;">
    <li>El producto debe estar sin usar y con etiquetas originales</li>
    <li>Incluye el número de RMA en el paquete</li>
    <li>Conserva el comprobante de envío</li>
  </ul>
</div>
`);
  }

  static returnRejected(returnNumber: string, reason: string) {
    return baseTemplate(`
<h2 style="color:#dc2626;">❌ Devolución Rechazada</h2>

<p>Lamentablemente, tu solicitud de devolución <strong>${returnNumber}</strong> no ha sido aprobada.</p>

<div style="background:#fee2e2;border-left:4px solid #dc2626;padding:12px;margin:16px 0;">
  <p style="margin:0;"><strong>Motivo:</strong></p>
  <p style="margin:8px 0;">${reason}</p>
</div>

<p>Si crees que esto es un error o tienes preguntas, no dudes en contactarnos respondiendo este correo.</p>
`);
  }

  static returnReceived(returnNumber: string) {
    return baseTemplate(`
<h2 style="color:#0284c7;">📦 Producto Recibido</h2>

<p>Hemos recibido tu producto de la devolución <strong>${returnNumber}</strong>.</p>

<div style="background:#e0f2fe;border-left:4px solid #0284c7;padding:12px;margin:16px 0;">
  <p style="margin:0;"><strong>📋 Próximos pasos:</strong></p>
  <ol style="margin:8px 0;padding-left:20px;">
    <li>Inspeccionaremos el producto en las próximas 24-48 horas</li>
    <li>Te notificaremos el resultado de la inspección</li>
    <li>Si todo está correcto, procesaremos el reembolso</li>
  </ol>
</div>

<p style="color:#6b7280;font-size:13px;">
El reembolso puede tardar 5-10 días hábiles en reflejarse en tu cuenta.
</p>
`);
  }

  static refundProcessed(returnNumber: string, refundedAmount: number, paymentMethod: string) {
    return baseTemplate(`
<h2 style="color:#16a34a;">💰 Reembolso Procesado</h2>

<p>El reembolso de tu devolución <strong>${returnNumber}</strong> ha sido procesado exitosamente.</p>

<table width="100%" style="margin:16px 0;background:#dcfce7;padding:16px;border-radius:6px;">
<tr>
  <td><strong>Monto reembolsado:</strong></td>
  <td><strong style="color:#16a34a;font-size:18px;">${money(refundedAmount)}</strong></td>
</tr>
<tr>
  <td><strong>Método de pago:</strong></td>
  <td>${paymentMethod}</td>
</tr>
</table>

<div style="background:#fef9c3;border-left:4px solid #eab308;padding:12px;margin:16px 0;">
  <p style="margin:0;"><strong>⏰ Tiempos de acreditación:</strong></p>
  <p style="margin:8px 0;">El dinero se acreditará en el mismo medio de pago utilizado. 
  El plazo puede ser de 5 a 10 días hábiles según tu banco o tarjeta.</p>
</div>

<p style="text-align:center;font-size:14px;color:#6b7280;margin-top:24px;">
¡Gracias por tu paciencia!
</p>
`);
  }
}
