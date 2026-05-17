import nodemailer from 'nodemailer';
import { Order } from '@/types';

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

function buildEmailHTML(order: Order): string {
  const productRows = order.products
    .map(
      (p) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">${p.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">S/ ${p.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;"><strong>S/ ${p.subtotal.toFixed(2)}</strong></td>
      </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #4D2C73; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
    <h1 style="color: #B89346; margin: 0; font-size: 24px;">Luminé</h1>
    <p style="color: #F7F7F2; margin: 4px 0 0;">Nuevo pedido contra entrega registrado</p>
  </div>

  <div style="background: #F7F7F2; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #4D2C73; margin-top: 0;">Datos del Cliente</h2>
    <p><strong>Nombre:</strong> ${order.customerName} ${order.customerLastName}</p>
    <p><strong>Teléfono:</strong> ${order.phone}</p>
    <p><strong>Correo:</strong> ${order.email}</p>
  </div>

  <div style="background: #F7F7F2; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #4D2C73; margin-top: 0;">Dirección de Entrega</h2>
    <p><strong>Departamento:</strong> ${order.department}</p>
    <p><strong>Provincia:</strong> ${order.province}</p>
    <p><strong>Distrito:</strong> ${order.district}</p>
    <p><strong>Dirección:</strong> ${order.address}</p>
    <p><strong>Referencia:</strong> ${order.addressReference}</p>
    ${order.addressExtra ? `<p><strong>Adicional:</strong> ${order.addressExtra}</p>` : ''}
  </div>

  <div style="background: #F7F7F2; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
    <h2 style="color: #4D2C73; margin-top: 0;">Productos del Pedido</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr style="background: #4D2C73; color: white;">
          <th style="padding: 10px; text-align:left;">Producto</th>
          <th style="padding: 10px; text-align:center;">Cant.</th>
          <th style="padding: 10px; text-align:right;">Precio</th>
          <th style="padding: 10px; text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${productRows}</tbody>
    </table>
    <div style="text-align: right; margin-top: 16px; font-size: 20px; color: #4D2C73;">
      <strong>Total: S/ ${order.total.toFixed(2)}</strong>
    </div>
  </div>

  ${order.notes ? `<div style="background: #fff3cd; border-radius: 8px; padding: 16px; margin-bottom: 20px;"><strong>Nota del cliente:</strong> ${order.notes}</div>` : ''}

  <div style="background: #d4edda; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
    <p style="margin:0;"><strong>ID del Pedido:</strong> ${order.id}</p>
    <p style="margin:4px 0 0;"><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString('es-PE')}</p>
    <p style="margin:4px 0 0;"><strong>Estado:</strong> ${order.status}</p>
  </div>

  <p style="color: #999; font-size: 12px; text-align: center;">
    Este correo fue generado automáticamente por el sistema de Luminé.
  </p>
</body>
</html>`;
}

export async function sendOrderNotification(order: Order) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.log('[Mailer] Variables de entorno no configuradas. Saltando envío de correo.');
    return;
  }

  const transporter = createTransporter();
  const html = buildEmailHTML(order);

  const recipients = [
    process.env.EMAIL_ADMIN,
    process.env.EMAIL_MARKETING,
  ].filter(Boolean).join(',');

  if (!recipients) return;

  await transporter.sendMail({
    from: `"Luminé Tienda" <${process.env.EMAIL_USER}>`,
    to: recipients,
    subject: `Nuevo pedido contra entrega registrado — ${order.customerName} ${order.customerLastName}`,
    html,
  });
}
