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
      <p style="margin:4px 0 0;font-size:13px;color:#d1d5db;">
        Confirmación de compra
      </p>
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
}
